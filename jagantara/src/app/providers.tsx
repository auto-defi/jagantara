"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/graphql";

// Stacks wallet context provider
import { StacksWalletProvider } from "@/hooks/useStacksWallet";

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <StacksWalletProvider>
            {props.children}
          </StacksWalletProvider>
        </ThemeProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}
