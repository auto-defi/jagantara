"use client";
import Image from "next/image";
import Link from "next/link"; // Use Next.js Link for internal navigation

// A reusable component for footer links to keep the code clean
type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
};

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <li>
    <Link
      href={href}
      className="hover:text-[var(--text)] transition-colors duration-300 text-slate-500 font-medium"
    >
      {children}
    </Link>
  </li>
);

export default function Footer() {
  // Define the link data in an object for easier management
  const footerSections = {
    Resources: [
      { name: "Documentation", href: "#" },
      { name: "Research", href: "#" },
      { name: "GitHub", href: "#" },
      { name: "Brand Kit", href: "#" },
      { name: "Audits", href: "#" },
    ],
    "Data & Analytics": [
      { name: "Block Analitica", href: "#" },
      { name: "Dune", href: "#" },
      { name: "Token Terminal", href: "#" },
      { name: "DeFiLlama", href: "#" },
    ],
    Community: [
      { name: "Twitter", href: "https://x.com/Jagantara_ofc" },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/jaganusantara",
      },
      { name: "Instagram", href: "https://www.instagram.com/jagantara.xyz" },
      { name: "Discord", href: "https://discord.gg/fNkrb6FB55" },
      { name: "Telegram", href: "https://t.me/+QjYXOLJ3diNmM2I1" },
    ],
    Company: [
      { name: "Terms of use", href: "#" },
      { name: "Legal Notice", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Disclaimers", href: "#" },
    ],
  };

  return (
    <footer className="w-full mt-5 bg-[image:var(--gradient-secondary)] text-text h-fit">
      <div className=" mx-auto px-10 md:px-20 py-10 flex flex-col md:flex-row justify-between">
        {/* Logo Section */}
        <div className="mb-12">
          {/* Ensure your icon is optimized for both light and dark themes */}
          <Image
            src="/jagantara_icon.png"
            width={70}
            height={70}
            alt="Jagantara Icon"
          />
        </div>

        {/* Links Section - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-28">
          {Object.entries(footerSections).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-base mb-4">{title}</h3>
              <ul className="space-y-6 text-sm md:text-md">
                {links.map((link) => (
                  <FooterLink key={link.name} href={link.href}>
                    {link.name}
                  </FooterLink>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className=" mx-auto px-10 md:px-20 py-10 flex justify-between mt-20">
        <p className="text-slate-500 md:text-md text-sm">
          © 2025 Jagantara. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
