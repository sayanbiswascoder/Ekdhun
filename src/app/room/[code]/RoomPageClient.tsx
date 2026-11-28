
"use client";

import React from "react";
import SessionInfo from "@/app/room/[code]/components/SessionInfo";
import RoomClient from "@/app/room/[code]/RoomClient";
import { FaClockRotateLeft } from "react-icons/fa6";
import { MdArrowBackIosNew } from "react-icons/md";;

export default function RoomPageClient({ code }: { code: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#080D1B] text-white">
      <aside
        className={`absolute left-0 top-0 z-40 h-full w-full md:w-1/4
          bg-[#080D1B] border-r border-white/10
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SessionInfo code={code} />
      </aside>

      <main
        className={`
          h-full min-w-0 overflow-y-auto
          transition-[width,margin-left] duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "w-full md:w-3/4 md:ml-[25%]"
              : "w-full ml-0"
          }
        `}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-3 z-40 p-3 rounded-xl
           backdrop-filter backdrop-blur-xl border border-white/10
          transition-all duration-300 ease-in-out
          ${isSidebarOpen
            ? "left-[97%] -translate-x-full md:left-[26%] md:translate-x-0"
            : "left-3"
          }`}
          aria-label="Toggle session info"
        >
          <span
            className="flex items-center justify-center transition-transform duration-500 ease-in-out"
            style={{
              transform: isSidebarOpen ? "rotate(-360deg)" : "rotate(0deg)",
            }}
          >
            {isSidebarOpen ? (
              <MdArrowBackIosNew size={22} />
            ) : (
              <FaClockRotateLeft size={22} />
            )}
          </span>
        </button>

        <RoomClient code={code} />
      </main>
    </div>
  );
}
