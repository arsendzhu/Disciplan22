import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/jetbrains-mono/500.css";

import { Providers } from "@/components/providers/Providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse",
  description: "AI productivity companion for college students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
