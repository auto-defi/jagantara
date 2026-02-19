import React from "react";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function CampaignGrid() {
  return (
    <BentoGrid className="mt-3">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          // Optional: Make some items span full width
          //   className={i === 3 || i === 6 ? "md:col-span-3" : ""}
        />
      ))}
    </BentoGrid>
  );
}

function Skeleton() {
  return (
    <div className="h-32 w-max-7xl rounded-xl bg-neutral-200 dark:bg-neutral-800" />
  );
}

const items = [
  {
    title: "Binance Labs",
    description:
      "Accelerating the growth of blockchain projects through strategic investments and technical expertise by Binance.",
    header: (
      <Image
        src={"/campaign_logos/bnb_launchpad.png"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl object-cover"
        alt="BNB Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          200+ Projects Backed
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $9B+ Raised
        </Badge>
      </div>
    ),
  },
  {
    title: "Coinbase Ventures",
    description:
      "Backing early-stage crypto and Web3 startups with the support of one of the largest regulated exchanges in the world.",
    header: (
      <Image
        src={"/campaign_logos/coinbase_logo.png"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl object-cover"
        alt="Coinbase Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          350+ Projects Backed
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $5B+ Raised
        </Badge>
      </div>
    ),
  },
  {
    title: "Bank Indonesia",
    description:
      "Indonesia’s central bank exploring CBDCs, blockchain adoption, and financial innovation through regulatory sandboxes.",
    header: (
      <Image
        src={"/campaign_logos/BI_logo.jpg"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl object-cover"
        alt="BI Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          Garuda Project
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $10M+ Raised
        </Badge>
      </div>
    ),
  },
  {
    title: "Mantle Spark",
    description:
      "A Web3 launchpad and incubator leveraging Mantle's fast, accessible, and developer-friendly blockchain to empower gaming, metaverse, and NFT projects.",
    header: (
      <Image
        src={"/campaign_logos/mantle_logo.svg"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl"
        alt="Mantle Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          70+ Projects Backed
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $50M+ Raised
        </Badge>
      </div>
    ),
  },
  {
    title: "DAO Maker",
    description:
      "Pioneering the retail venture capital model with decentralized fundraising for high-potential blockchain startups.",
    header: (
      <Image
        src={"/campaign_logos/daomaker_logo.webp"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl object-cover"
        alt="DAO Maker Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          100+ Projects Backed
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $80M+ Raised
        </Badge>
      </div>
    ),
  },
  {
    title: "OpenSea",
    description:
      "The world’s largest NFT marketplace, enabling users to buy, sell, and create digital assets with ease and security.",
    header: (
      <Image
        src={"/campaign_logos/opensea_logo.png"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl object-cover"
        alt="OpenSea Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          1M+ Collections
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $25B+ Traded
        </Badge>
      </div>
    ),
  },
  {
    title: "Uniswap",
    description:
      "A decentralized exchange protocol enabling permissionless trading and liquidity provision across the Ethereum ecosystem.",
    header: (
      <Image
        src={"/campaign_logos/uniswap_logo.jpg"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl"
        alt="Uniswap Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          500+ Tokens Listed
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $2T+ Volume
        </Badge>
      </div>
    ),
  },
  {
    title: "Seedify Launchpad",
    description:
      "A leading Web3 launchpad and incubator empowering blockchain gaming, metaverse, and NFT projects to thrive.",
    header: (
      <Image
        src={"/campaign_logos/seedify_logo.png"}
        width={600}
        height={250}
        className="bg-neutral-200 dark:bg-neutral-800 h-32 rounded-xl"
        alt="Seedify Logo"
      />
    ),
    icon: (
      <div className="flex gap-1 flex-wrap">
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          70+ Projects Backed
        </Badge>
        <Badge className="bg-[image:var(--gradient-accent-soft)]">
          $50M+ Raised
        </Badge>
      </div>
    ),
  },
];
