import GradientText from "@/components/gradient-text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
export default function FAQLanding() {
  return (
    <div className="md:w-3/4 px-4 sm:px-6 md:px-8 mx-auto">
      <div className="text-center mb-10 sm:mb-12">
        <div
          className="relative inline-flex items-center justify-center rounded-md p-[1px] bg-[length:200%_200%] animate-[borderMove_4s_ease_infinite] bg-[linear-gradient(110deg,#3b82f6,#06b6d4,#3b82f6)] mb-2"
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-background text-sm font-medium text-white">
            <Shield className=" font-bold text-white" fill="white" size={15} />
            Frequently Asked Questions
          </div>

          <style jsx>{`
            @keyframes borderMove {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
          `}</style>
        </div>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl mb-4 space-y-1">
          Everything You Need to Know About <br className="hidden sm:block" />{" "}
          <GradientText
            colors={[
              "var(--primary)",
              "var(--accent)",
              "var(--primary)",
              "var(--accent)",
            ]}
            animationSpeed={6}
            showBorder={false}
            className="font-bold"
          >
            Jagantara
          </GradientText>
        </h2>
        <p className="text-[var(--text)]/70 text-base sm:text-lg max-w-2xl mx-auto">
          Get answers to the most common questions about protecting your digital
          assets with comprehensive insurance coverage.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {[
          {
            value: "item-1",
            question:
              "What types of digital assets are covered by your insurance?",
            answer:
              "Our comprehensive coverage includes cryptocurrencies (Bitcoin, Ethereum, and 500+ altcoins), NFTs, digital tokens, stablecoins, and other blockchain-based assets. We also cover digital wallets, private keys, and smart contract interactions. Coverage extends to both hot and cold storage solutions.",
          },
          {
            value: "item-2",
            question:
              "How does the claims process work for digital asset theft or loss?",
            answer:
              "Our streamlined claims process begins with filing a claim through our secure portal within 48 hours of discovery. You'll need to provide transaction hashes, wallet addresses, and relevant documentation. Our blockchain forensics team investigates each claim, and approved claims are typically settled within 10-15 business days. We work with leading blockchain analysis firms to verify losses.",
          },
          {
            value: "item-3",
            question: "What security measures do you require for coverage?",
            answer:
              "We require multi-factor authentication (MFA) on all accounts, use of hardware wallets for significant holdings, regular security audits, and adherence to our security best practices guide. For institutional clients, we may require additional measures like multi-signature wallets, cold storage protocols, and employee background checks.",
          },
          {
            value: "item-4",
            question:
              "Are there coverage limits and what factors affect my premium?",
            answer:
              "Coverage limits range from $10,000 to $100 million depending on your plan. Premiums are calculated based on asset types, storage methods, security measures implemented, claim history, and total coverage amount. Hardware wallet users and those with strong security practices receive significant discounts. We offer both individual and institutional pricing tiers.",
          },
          {
            value: "item-5",
            question:
              "Does your insurance cover smart contract failures and DeFi protocol risks?",
            answer:
              "Yes, our DeFi coverage includes smart contract bugs, protocol exploits, flash loan attacks, and governance token risks. We cover losses from audited protocols and maintain a whitelist of covered DeFi platforms. Coverage includes yield farming, liquidity provision, and staking activities on approved protocols. Experimental or unaudited protocols require additional premium.",
          },
          {
            value: "item-6",
            question: "How do you handle regulatory compliance and reporting?",
            answer:
              "We maintain full regulatory compliance across all jurisdictions where we operate. Our policies meet or exceed requirements from financial regulators, and we provide necessary documentation for tax reporting. We're licensed as an insurance provider and work with regulatory bodies to ensure our coverage meets evolving digital asset regulations.",
          },
          {
            value: "item-7",
            question:
              "What happens if an exchange or custodian I use gets hacked?",
            answer:
              "Our exchange coverage protects your assets held on supported centralized exchanges and custodial services. If a covered exchange suffers a security breach resulting in loss of your funds, we'll compensate you up to your policy limits. We maintain partnerships with major exchanges and continuously monitor their security practices to ensure coverage eligibility.",
          },
          {
            value: "item-8",
            question:
              "Can I get coverage for my business's digital asset operations?",
            answer:
              "Absolutely. Our commercial policies cover businesses of all sizes, from startups to enterprises. Coverage includes employee theft, operational errors, cyber attacks, and business interruption due to digital asset losses. We offer specialized coverage for crypto exchanges, DeFi protocols, NFT marketplaces, and blockchain development companies with tailored risk assessments.",
          },
        ].map(({ value, question, answer }) => (
          <AccordionItem
            key={value}
            value={value}
            className="px-4 sm:px-6 bg-background "
          >
            <AccordionTrigger className="text-left hover:no-underline cursor-pointer text-base sm:text-lg font-medium">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm sm:text-base">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
