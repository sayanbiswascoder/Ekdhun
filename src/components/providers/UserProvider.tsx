
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { generateGuestName } from "@/lib/identity";

interface Profile {
  id: string;
  username: string;
}

interface UserContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string;
  updateUsername: (username: string) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

// Prevent duplicate anonymous sign-ins during React Strict Mode effect replay.
let initializationPromise:
  | Promise<{ user: User; profile: Profile }>
  | null = null;

async function initializeUser() {
  const supabase = createClient();

  let {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  if (!session) {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) throw error;
    session = data.session;
  }

  const user = session?.user;

  if (!user) {
    throw new Error("Unable to initialize your guest account.");
  }

  const { data: existingProfile, error: profileReadError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .maybeSingle();

  if (profileReadError) throw profileReadError;

  let profile = existingProfile as Profile | null;

  if (!profile) {
    const newProfile = {
      id: user.id,
      username: generateGuestName(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(newProfile, { onConflict: "id" })
      .select("id, username")
      .single();

    if (error) throw error;
    profile = data as Profile;
  }

  return { user, profile };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!initializationPromise) {
      initializationPromise = initializeUser().catch((err) => {
        initializationPromise = null;
        throw err;
      });
    }

    initializationPromise
      .then(({ user, profile }) => {
        if (cancelled) return;
        setUser(user);
        setProfile(profile);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unable to initialize your account."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function updateUsername(username: string) {
    const cleanUsername = username.trim();

    if (cleanUsername.length < 2 || cleanUsername.length > 30) {
      throw new Error("Username must be between 2 and 30 characters.");
    }

    if (!user) {
      throw new Error("Your guest account is not ready yet.");
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id, username")
      .single();

    if (error) throw error;

    setProfile(data as Profile);
  }

  return (
    <UserContext.Provider
      value={{ user, profile, loading, error, updateUsername }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider.");
  }

  return context;
}
