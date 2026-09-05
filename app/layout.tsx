import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RealtimeProvider } from "@/components/providers/ably-provider";
import SWLoader from "@/components/providers/sw-loader";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Null Chat",
  description: "Null Chat - Secure Messaging Platform",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SWLoader />
      <html lang="en" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <RealtimeProvider>
                <Toaster />
                <main> {children}</main>
              </RealtimeProvider>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
