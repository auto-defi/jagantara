// app/components/Header.tsx
"use client";

import { useState } from "react";
import { SiFarcaster } from "react-icons/si";
import { usePathname, useRouter } from "next/navigation";
import {
  FaDiscord,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

export default function Header() {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();
  const pathname = usePathname(); // get current path

  return (
    <footer
      className="px-6 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between w-full bottom-0 md:fixed z-50"
      style={{ background: "var(--background)" }}
    >
      {/* Left: Logo & Nav */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 mb-4 md:mb-0">
        <nav className="flex flex-col md:flex-row gap-2 md:gap-10 text-slate-500 transition-colors duration-100 ease-in text-sm md:text-base">
          <button className="hover:text-[var(--text)] cursor-pointer">
            Docs
          </button>
          <button className="hover:text-[var(--text)] cursor-pointer">
            Policies
          </button>
          <button className="hover:text-[var(--text)] cursor-pointer">
            Terms and Conditions
          </button>
          <button className="hover:text-[var(--text)] cursor-pointer">
            Support Center
          </button>
        </nav>
      </div>

      {/* Right: Socials & Copyright */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
        <div className="flex gap-3">
          <a href="https://x.com/Jagantara_ofc" target="_blank">
            <FaXTwitter size={18} />
          </a>
          <a href="https://discord.gg/fNkrb6FB55" target="_blank">
            <FaDiscord size={18} />
          </a>
          <a
            href="https://www.linkedin.com/company/jaganusantara"
            target="_blank"
          >
            <FaLinkedin size={18} />
          </a>
          <a href="https://www.instagram.com/jagantara.xyz" target="_blank">
            <FaInstagram size={18} />
          </a>
          <a href="https://t.me/+QjYXOLJ3diNmM2I1" target="_blank">
            <FaTelegramPlane size={18} />
          </a>
        </div>
        <p className="text-slate-500 text-xs md:text-sm text-center md:text-right">
          © 2025 Jagantara. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
