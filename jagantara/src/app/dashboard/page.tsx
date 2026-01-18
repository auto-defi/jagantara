import GradientText from "@/components/gradient-text";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Jagantara | Dashboard",
  description: "Decentralized coverage",
  icons: "./jagantara_icon.png",
};

export default function DashboardPage() {
  return (
    <main className="w-full pt-2 " style={{ background: "var(--background)" }}>
      <section className="bg-[image:var(--gradient-secondary)] mx-10 p-8 rounded-3xl h-[80vh] overflow-y-auto hide-scrollbar py-16 ">
        <div className="w-full flex flex-col gap-16">
          <div className="flex flex-col gap-10 justify-center items-center">
            <div className="w-11/12 flex justify-start">
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
                Earn
              </GradientText>
            </div>
            <div
              className="h-72 w-11/12 rounded-3xl p-2 bg-[var(--background)]"
              style={{
                boxShadow: "0 0 15px 4px rgba(0, 123, 255, 0.2)",
              }}
            >
              <div className="flex flex-col justify-center items-center h-full">
                <Image
                  src="/jagantara_icon.png"
                  alt="Logo"
                  width={50}
                  height={50}
                />
                <span className="font-regular text-md text-slate-500">
                  No Position Found
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 justify-center items-center">
            <div className="w-11/12 flex justify-start">
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
                Claim
              </GradientText>
            </div>
            <div
              className="h-72 bg-[var(--background)] w-11/12 rounded-3xl p-2 "
              style={{
                boxShadow: "0 0 15px 4px rgba(0, 123, 255, 0.2)",
              }}
            >
              <div className="flex flex-col justify-center items-center h-full">
                <Image
                  src="/jagantara_icon.png"
                  alt="Logo"
                  width={50}
                  height={50}
                />
                <span className="font-regular text-md text-slate-500">
                  No Position Found
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
