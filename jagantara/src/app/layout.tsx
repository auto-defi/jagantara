// app/layout.tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import TransitionClient from "@/app/components/TransitionClient";
import AppShell from "./components/AppShell";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "Jagantara | Indonesian Insurance for Digital Assets",
  description: "Decentralized coverage",
  icons: "./jagantara_icon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Client logic isolated in this component */}
        <TransitionClient />
        <Providers>
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
