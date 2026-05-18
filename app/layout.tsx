import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NewControl. Write the new control.",
  description:
    "NewControl turns your offer into sales letters, cold emails, landing pages, and ad copy using the 22-step framework behind direct mail winners that have generated billions in measured revenue.",
  metadataBase: new URL("https://newcontrol.app"),
  openGraph: {
    title: "NewControl. Write the new control.",
    description:
      "Direct response copy, engineered. The 22-step framework behind proven controls, now writing letters, emails, ads, and landing pages.",
    url: "https://newcontrol.app",
    siteName: "NewControl",
    type: "website",
  },
};

const themeInitScript =
  "(function(){try{var s=localStorage.getItem('theme');if(s==='dark')document.documentElement.classList.add('dark');}catch(e){}})();";
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={inter.variable + " " + instrumentSerif.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-bg text-fg font-sans antialiased grain transition-colors">
        {children}
      </body>
    </html>
  );
}
