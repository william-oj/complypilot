import "./globals.css";
import { Space_Grotesk, Fraunces } from "next/font/google";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif" });

export const metadata = {
  title: "ComplyPilot",
  description: "ISO 27001 made simple"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${fraunces.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
