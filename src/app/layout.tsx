import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@components/theme-provider";
import Page from "@components/sidebar";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "UAS IUM",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={typeof window !== "undefined" ? "light" : "dark"}
      style={{ colorScheme: typeof window !== "undefined" ? "light" : "dark" }}
    >
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Page>
          <main>{children}</main>
        </Page>
      </body>
    </html>
  );
}
