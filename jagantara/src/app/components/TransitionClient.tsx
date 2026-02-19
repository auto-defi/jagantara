// components/TransitionClient.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animatePageIn } from "@/lib/transition";

export default function TransitionClient() {
  const pathname = usePathname();

  useEffect(() => {
    animatePageIn(); // Trigger GSAP transition
  }, [pathname]);

  return (
    <>
      {pathname === "/" && (
        <div
          id="transition-element"
          className="w-screen h-screen bg-[image:var(--gradient-secondary)] fixed top-0 left-0 flex justify-center items-center z-100 flex-col "
        >
          Please Wait
          <div className="flex loading mt-5">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
          </div>
        </div>
      )}
    </>
  );
}
