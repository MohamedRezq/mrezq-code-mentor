import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Devling - Learn to Code with AI",
  description:
    "Master programming with personalized AI-powered lessons that adapt to your learning style.",
  keywords: ["learn to code", "AI coding tutor", "programming lessons", "JavaScript", "web development"],
  authors: [{ name: "Devling" }],
  openGraph: {
    title: "Devling - Learn to Code with AI",
    description: "Master programming with personalized AI-powered lessons that adapt to your learning style.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devling - Learn to Code with AI",
    description: "Master programming with personalized AI-powered lessons that adapt to your learning style.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
