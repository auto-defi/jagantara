import "@/styles/globals.css";
import React, { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = [
    "#00095c", // primary (deep blue)
    "#578cff", // accent (bright blue)
    "#00095c",
    "#578cff",
    "#00095c",
  ],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div className="font-light">
      {showBorder && (
        <div className="gradient-overlay" style={gradientStyle}></div>
      )}
      <div
        className={`text-content inline-block relative z-2 text-transparent bg-cover animate-gradient pb-2 text-3xl tracking-tight  md:text-5xl px-2 ${className}`}
        style={gradientStyle}
      >
        {children}
      </div>
    </div>
  );
}
