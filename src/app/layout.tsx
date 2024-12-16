import type { Metadata } from "next";
import "./globals.css";
// import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/ui/toaster";
import { getApotek } from "@/actions/apotek";

const apotek = await getApotek()

export const metadata: Metadata = {
  title: apotek.name ?? "Apotek",
  description: "",
  category: "inventory",
  icons: "/logo.jpg",
  creator: "",
  openGraph: {
    type: "website",
    images: "/logo.jpg",
    title: apotek.name,
    url: "",
    emails: apotek.email!,
    phoneNumbers: apotek.phone!
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body >
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  );
}
