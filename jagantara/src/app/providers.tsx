"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Config, State, WagmiProvider } from "wagmi";

import { darkTheme, XellarKitProvider } from "@xellar/kit";
import { config } from "@/app/lib/connector/xellar";
import { ThemeProvider } from "@/components/theme-provider";
import FadeContent from "@/components/fade-content";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/graphql";
export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [wagmiConfig] = useState<Config>(() => config);
  return (
    <WagmiProvider config={wagmiConfig}>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <XellarKitProvider theme={darkTheme} showConfirmationModal={true}>
              {/* <FadeContent
              blur={false}
              duration={2000}
              easing="ease-out"
              initialOpacity={0}
            > */}
              {props.children}
              {/* </FadeContent> */}
            </XellarKitProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </WagmiProvider>
  );
}
