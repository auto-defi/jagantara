import { Metadata } from "next";
import CoverageInterface from "./components/CoverageInterface";
export const metadata: Metadata = {
  title: "Jagantara | Coverage",
  description: "Decentralized coverage",
  icons: "./jagantara_icon.png",
};
export default function ClaimPage() {
  return (
    <main className="w-full pt-2 " style={{ background: "var(--background)" }}>
      <section className=" px-10 md:mx-10 md:px-20 rounded-3xl md:h-[80vh] overflow-y-auto hide-scrollbar ">
        <div className="">
          <CoverageInterface />
        </div>
      </section>
    </main>
  );
}
