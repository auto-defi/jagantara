import { Metadata } from "next";

import StakingDetail from "./components/StakingDetail";
export const metadata: Metadata = {
  title: "Jagantara | Earn",
  description: "Decentralized coverage",
  icons: "./jagantara_icon.png",
};
export default function EarnPage() {
  // const [timeFilter, setTimeFilter] = useState("12M");
  return (
    <main className="w-full pt-2 " style={{ background: "var(--background)" }}>
      <section className="md:bg-[image:var(--gradient-secondary)] px-5 md:mx-10 md:px-32 rounded-3xl md:h-[80vh] overflow-y-auto hide-scrollbar ">
        <div className="py-10">
          <StakingDetail />
        </div>
      </section>
    </main>
  );
}
