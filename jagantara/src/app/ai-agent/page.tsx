import { Metadata } from "next";
import GradientText from "@/components/gradient-text";

export const metadata: Metadata = {
  title: "Jagantara | AI Agent",
  description: "AI Agent (x402 payments + on-chain policy purchase)",
  icons: "./jagantara_icon.png",
};

export default function AIAgentPage() {
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
            AI Agent
          </GradientText>
          <p className="text-md md:text-lg text-center font-light">
            How AI Agents can buy insurance policies, pay via x402 (USDCx), and
            execute on-chain actions on Stacks testnet.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
            <h2 className="text-lg md:text-xl font-semibold mb-3">
              AI Agent actions
            </h2>
            <div className="space-y-3 text-sm text-white/80">
              <p>
                Jagantara exposes an MCP-compatible endpoint at{" "}
                <code className="text-white">/api/mcp</code>. On Stacks{" "}
                <b>testnet</b>, the server enforces an <b>x402-style paywall</b>
                for certain tools.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <code className="text-white">buy_insurance_onchain</code>:
                  buys a policy (premium) by calling{" "}
                  <code className="text-white">
                    insurance-manager-v2.pay-premium
                  </code>
                  .
                </li>
                <li>
                  <code className="text-white">create_claim_onchain</code>:
                  creates a claim record (server-side tool).
                </li>
              </ul>
              <p className="text-white/70">
                Payment verification logic lives in
                <code className="text-white">
                  {" "}
                  jagantara/src/lib/x402/stacks-x402.ts
                </code>
                .
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
            <h2 className="text-lg md:text-xl font-semibold mb-3">
              How to pay (x402)
            </h2>
            <div className="space-y-3 text-sm text-white/80">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Call <code className="text-white">POST /api/mcp</code> with
                  the tool name.
                </li>
                <li>
                  If payment is required, the response includes the x402
                  requirement (header name, merchant address, and USDCx token
                  contract).
                </li>
                <li>
                  Send a SIP-010 <code className="text-white">transfer</code> on
                  the USDCx token to the merchant address.
                </li>
                <li>
                  Retry the request including the transfer txid in the header
                  <code className="text-white"> x-payment-txid</code> (or the
                  configured header).
                </li>
              </ol>

              <div className="mt-4 rounded-xl bg-black/30 border border-white/10 p-4">
                <div className="text-xs font-semibold text-white/90 mb-2">
                  Example (agent request)
                </div>
                <pre className="text-xs overflow-x-auto text-white/80 whitespace-pre-wrap">
{`curl -s -X POST http://localhost:3000/api/mcp \\
  -H 'content-type: application/json' \\
  -d '{"action":"call","name":"buy_insurance_onchain","arguments":{"tier":1,"duration":1,"covered_address":"ST...","amount_to_cover":"1000000"}}'`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 p-5 border border-white/10">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Flow diagram</h2>
          <pre className="text-xs md:text-sm overflow-x-auto text-white/80 whitespace-pre">
{`┌───────────────┐      ┌──────────────────────┐
│   AI Agent     │      │ Jagantara API (MCP)   │
│ (client/tool)  │      │   POST /api/mcp       │
└───────┬────────┘      └──────────┬───────────┘
        │                           │
        │ 1) tool call              │
        ├──────────────────────────▶│
        │                           │
        │ 2) 402 + x402 requirement │
        │◀──────────────────────────┤
        │                           │
        │ 3) USDCx transfer (SIP-010) to merchant
        ├──────────────────────────▶  (Stacks testnet)
        │                           │
        │ 4) retry w/ x-payment-txid header
        ├──────────────────────────▶│
        │                           │ 5) verify transfer txid
        │                           │ 6) broadcast contract call
        │                           │
        │ 7) response (txid/result) │
        │◀──────────────────────────┘`}
          </pre>
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 p-5 border border-white/10">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Recent AI Agent payments
          </h2>

          <div className="space-y-3">
            {[
              {
                role: "agent",
                text: "Paid x402 for buy_insurance_onchain (USDCx) — txid 0x83b599...9b25",
                link: "https://explorer.hiro.so/txid/83b59992020e355239ad1430a11bc5c2a31f18156060b0f8b1a3414c1f0e9b25?chain=testnet",
              },
              {
                role: "server",
                text: "Payment verified. Broadcasting insurance-manager-v2.pay-premium…",
              },
              {
                role: "agent",
                text: "Paid x402 for create_claim_onchain (USDCx) — txid 0xffedae...8673",
                link: "https://explorer.hiro.so/txid/ffedae8ffae2c77bfc0f53fb02622a68ceb700c84b031c9fff9479ccb2f88673?chain=testnet",
              },
              {
                role: "server",
                text: "Payment verified. Claim tool accepted (testnet).",
              },
            ].map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "agent"
                    ? "ml-auto max-w-[900px] rounded-2xl bg-[image:var(--gradient-accent-soft)] p-4 border border-white/10"
                    : "mr-auto max-w-[900px] rounded-2xl bg-black/30 p-4 border border-white/10"
                }
              >
                <div className="text-xs font-semibold text-white/80 mb-1">
                  {m.role === "agent" ? "AI Agent" : "Jagantara Server"}
                </div>
                <div className="text-sm text-white/90">{m.text}</div>
                {m.link && (
                  <a
                    className="mt-2 inline-block text-xs text-blue-300 hover:text-blue-200 break-all"
                    href={m.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {m.link}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-xs text-white/60">
            Note: This is a UI example. The server keeps recent payment txids
            in-memory for a TTL window.
          </div>
        </div>
      </section>
    </main>
  );
}

