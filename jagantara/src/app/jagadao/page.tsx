import { Metadata } from "next";
import DAOInterface from "./components/DAOInterface";

export const metadata: Metadata = {
  title: "Jagantara | JagaDAO",
  description: "Decentralized coverage",
  icons: "./jagantara_icon.png",
};

export default function JagaDAOPage() {
  return (
    <main className="w-full pt-2 " style={{ background: "var(--background)" }}>
      <section className=" md:mx-10 md:px-20 rounded-3xl md:h-[80vh] overflow-y-auto hide-scrollbar ">
        <div className="">
          <DAOInterface />
        </div>
      </section>
    </main>
  );
}
