import { Metadata } from "next";
import CampaignGrid from "./components/CampaignGrids";
import GradientText from "@/components/gradient-text";

export const metadata: Metadata = {
  title: "Jagantara | Campaign",
  description: "Decentralized coverage",
  icons: "./jagantara_icon.png",
};

export default function JagantaraCampaign() {
  return (
    <main className="w-full pt-2 " style={{ background: "var(--background)" }}>
      <section className="bg-[image:var(--gradient-secondary)] md:mx-10 p-4 md:p-8 rounded-3xl md:h-[80vh] overflow-y-auto hide-scrollbar py-8 ">
        <div className="flex justify-center flex-col items-center gap-2">
          <GradientText
            colors={[
              "var(--primary)",
              "var(--accent)",
              "var(--primary)",
              "var(--accent)",
            ]}
            animationSpeed={6}
            showBorder={false}
            className="font-normal"
          >
            Campaign
          </GradientText>
          <p className="text-md md:text-lg text-center font-light">
            The world's most respected investors and institutions have chosen
            Jagantara as their trusted insurance partner
          </p>
        </div>
        <CampaignGrid />
      </section>
    </main>
  );
}
