
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Headphones, ArrowUpRight, Loader2 } from "lucide-react";

interface PreviousRoom {
  id: string;
  name: string;
  room_code: string;
  role: "host" | "admin" | "member";
}

export default function PreviousRooms({
  userId,
}: {
  userId: string | null;
}) {
  const [rooms, setRooms] = useState<PreviousRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const container = scrollContainerRef.current;
  if (!container) return;

  const handleWheel = (e: WheelEvent) => {
      
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        console.log(e);
      e.preventDefault();
      container.scrollBy({
      left: e.deltaY,
      behavior: "instant",
    });
    }
  };

  container.addEventListener("wheel", handleWheel, {
    passive: false,
  });

  return () => {
    container.removeEventListener("wheel", handleWheel);
  };
}, [rooms.length]);

  useEffect(() => {
    let cancelled = false;

    async function loadPreviousRooms() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const supabase = createClient();

        const { data: memberships, error: membershipError } = await supabase
  .from("room_members")
  .select("room_id, role")
  .eq("user_id", userId);

if (membershipError) throw membershipError;

const roomIds = [
  ...new Set((memberships ?? []).map((item) => item.room_id)),
];

if (roomIds.length === 0) {
  if (!cancelled) setRooms([]);
  return;
}

const { data: roomData, error: roomError } = await supabase
  .from("rooms")
  .select("id, name, room_code")
  .in("id", roomIds);

if (roomError) throw roomError;
if (cancelled) return;

const roomsWithRoles = (roomData ?? []).map((room) => ({
  ...room,
  role: memberships?.find((member) => member.room_id === room.id)?.role ?? "member",
}));

setRooms(roomsWithRoles as PreviousRoom[]);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your previous rooms."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPreviousRooms();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
        <Loader2 size={14} className="animate-spin" />
        Loading recent rooms...
      </div>
    );
  }

  if (error) {
    return <p className="py-2 text-xs text-red-400">{error}</p>;
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center gap-2 py-3">
        <Headphones size={17} className="text-slate-500" />
        <p className="text-xs text-slate-500">
          No previous rooms yet. Your joined rooms will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden">
  <div
    ref={scrollContainerRef}
    className="flex w-full min-w-0 max-w-full flex-nowrap gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide"
  >
  {rooms.map((room) => (
    <Link
      key={room.id}
      href={`/room/${room.room_code}`}
      className="w-[165px] min-w-[165px] flex-none shrink-0 snap-start flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#07111f] px-4 py-3 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/5"
    >
      <div className="min-w-0 flex-1">
  <p className="truncate text-sm font-medium text-white">
    {room.name}
  </p>

  <div className="mt-2 flex items-center gap-2">
    <span className="text-[10px] tracking-wider text-slate-500">
      {room.room_code}
    </span>

    <span
      className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
        room.role === "host"
          ? "bg-purple-500/15 text-purple-300"
          : room.role === "admin"
          ? "bg-cyan-500/15 text-cyan-300"
          : "bg-white/5 text-slate-400"
      }`}
    >
      {room.role}
    </span>
  </div>
</div>

<ArrowUpRight
  size={17}
  className="shrink-0 text-cyan-400"
/>
    </Link>
  ))}
</div>
    </div>
  );
}
