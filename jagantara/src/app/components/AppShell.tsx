// app/components/AppShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLanding = pathname === "/";

  return (
    <>
      {isLanding ? <Header /> : <AppHeader />}
      {children}
      {isLanding && <Footer />}
      {!isLanding && <AppFooter />}
    </>
  );
}
