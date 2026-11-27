
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AudioLines,
  Check,
  Copy,
  Dices,
  Headphones,
  Loader2,
  Plus,
  Users,
} from "lucide-react";

import { useUser } from "@/components/providers/UserProvider";
import { createRoom, joinRoom } from "@/lib/rooms";
import { generateGuestName } from "@/lib/identity";
import PreviousRooms from "@/components/PreviousRooms";

type Mode = "create" | "join";

export default function Home() {
  const router = useRouter();

  const {
    user,
    profile,
    loading: authLoading,
    error: authError,
    updateUsername,
  } = useUser();

  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("Late Night Vibes");
  const [roomCode, setRoomCode] = useState("");
  const [mode, setMode] = useState<Mode>("create");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.username) setUsername(profile.username);
  }, [profile?.username]);

  async function handleContinue() {
    setError("");

    if (username.trim().length < 2 || username.trim().length > 30) {
      setError("Your name must be between 2 and 30 characters.");
      return;
    }

    if (mode === "create" && roomName.trim().length < 2) {
      setError("Please enter a room name.");
      return;
    }

    if (mode === "join" && roomCode.trim().length !== 6) {
      setError("Enter a valid 6-character room code.");
      return;
    }

    try {
      setLoading(true);

      await updateUsername(username);

      if (mode === "create") {
        const room = await createRoom(roomName);
        router.push(`/room/${room.room_code}`);
      } else {
        await joinRoom(roomCode);
        router.push(`/room/${roomCode.trim().toUpperCase()}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const ready = !authLoading && !!user && !authError;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080D18] text-white selection:bg-cyan-400/30">

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ambient-glow absolute -top-64 left-1/2 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[130px]" />
        <div className="ambient-glow-delay absolute -bottom-80 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.07] blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6">

        {/* Navbar */}
        <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07]">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300 p-1">
              <EkdhunIcon />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              ek<span className="text-cyan-300">dhun</span>
            </span>
          </a>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {authLoading ? "Connecting..." : "Ready to listen"}
          </div>
        </header>

        
{/* Main content */}
<section className="flex flex-1 items-center justify-center py-6 sm:py-8">
  <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_390px] lg:gap-14">

    {/* Left: Compact brand statement */}
    <div className="home-intro max-w-xl">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs text-slate-300">
        <Headphones size={14} className="text-cyan-300" />
        A little closer, even when miles apart
      </div>

      <div className="mb-5 flex h-10 items-center gap-[5px]">
        {[18, 30, 43, 25, 38, 48, 24, 36, 17, 30, 44, 20].map(
          (height, index) => (
            <span
              key={index}
              className="sound-bar w-[3px] rounded-full bg-cyan-300"
              style={{
                height: `${height}px`,
                animationDelay: `${index * 90}ms`,
              }}
            />
          )
        )}
      </div>

      <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-[62px]">
        Music is better
        <br />
        <span className="text-slate-500">when shared.</span>
      </h1>

      <p className="mt-5 max-w-md text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
        Create a listening room, invite your people, and
        experience every beat together — wherever you are.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-400 sm:text-sm">
        <div className="flex items-center gap-2">
          <AudioLines size={16} className="text-cyan-300" />
          Synchronized playback
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-cyan-300" />
          Shared listening
        </div>
      </div>
    </div>

    {/* Right: Room panel + previous rooms */}
    <div className="home-panel w-full space-y-5">

      {/* Existing Create / Join card */}
      <div className="rounded-2xl border border-white/[0.09] bg-[#101927]/90 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">

        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
            Get started
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Your next listening session.
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Create a new room or join your friends.
          </p>
        </div>

        {/* Display name */}
        <label className="mb-2 block text-xs font-medium text-slate-300">
          YOUR NAME
        </label>

        <div className="relative mb-5">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            placeholder="Enter your display name"
            className="w-full rounded-xl border border-white/10 bg-[#080F1B] px-4 py-3 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
          />

          <button
            type="button"
            title="Generate a name"
            onClick={() => setUsername(generateGuestName())}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-cyan-300"
          >
            <Dices size={17} />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-[#080F1B] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setError("");
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
              mode === "create"
                ? "bg-[#1B3442] text-cyan-200 shadow-sm"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            <Plus size={16} />
            Create room
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("join");
              setError("");
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
              mode === "join"
                ? "bg-[#1B3442] text-cyan-200 shadow-sm"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            <Users size={16} />
            Join room
          </button>
        </div>

        {/* Room input */}
        <div key={mode} className="mode-content">
          {mode === "create" ? (
            <>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                ROOM NAME
              </label>
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={60}
                placeholder="Give your room a name"
                className="w-full rounded-xl border border-white/10 bg-[#080F1B] px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
              />
            </>
          ) : (
            <>
              <label className="mb-2 block text-xs font-medium text-slate-300">
                ROOM CODE
              </label>
              <input
                value={roomCode}
                onChange={(e) =>
                  setRoomCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 6)
                  )
                }
                maxLength={6}
                placeholder="Enter your 6-character code"
                className="w-full rounded-xl border border-white/10 bg-[#080F1B] px-4 py-3 text-sm uppercase tracking-[0.25em] outline-none transition-all placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10"
              />
            </>
          )}
        </div>


{/* Previous rooms - horizontal carousel */}
<div className="mt-5">
  <div className="mb-2 flex items-center justify-between">
    <label className="text-xs font-medium text-slate-300">
      RECENT ROOMS
    </label>
    <span className="text-[10px] text-slate-500">
      Scroll to explore →
    </span>
  </div>

  <PreviousRooms userId={user?.id ?? null} />
</div>


        {(error || authError) && (
          <p className="mt-3 text-sm text-red-400">
            {error || authError}
          </p>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={loading || !ready}
          className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-sm font-semibold text-[#07111B] transition-all duration-200 hover:bg-cyan-200 hover:shadow-[0_0_28px_rgba(103,232,249,0.16)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading || authLoading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              {authLoading ? "Preparing your session..." : "Please wait..."}
            </>
          ) : (
            <>
              {mode === "create" ? "Create listening room" : "Join listening room"}
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Check size={13} className="text-emerald-400" />
          Free to use · No account required
        </div>
      </div>
    </div>
  </div>
</section>


        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-slate-500 sm:flex-row">
          <span>© 2026 Ekdhun</span>
          <span className="flex items-center gap-1.5">
            Made for people who love music.
            <AudioLines size={13} className="text-cyan-300" />
          </span>
        </footer>
      </div>
    </main>
  );
}

const EkdhunIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="512"
    height="512"
    fill="none"
    viewBox="0 0 512 512"
  >
    <path
      stroke="url(#paint0_linear_1_2)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="25"
      d="M154 83c-19-11-43 3-43 26v294c0 23 24 37 43 26l237-138c19-11 19-39 0-50z"
    ></path>
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth="17"
      d="M163 235v42M199 216v80M235 190v132M271 216v80M307 235v42"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_1_2"
        x1="104"
        x2="410"
        y1="100"
        y2="412"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B84DFF"></stop>
        <stop offset="0.52" stopColor="#7B5CFF"></stop>
        <stop offset="1" stopColor="#00C8F5"></stop>
      </linearGradient>
    </defs>
  </svg>
);
