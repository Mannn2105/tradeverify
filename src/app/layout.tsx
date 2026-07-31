import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Zilla_Slab } from "next/font/google";
import "./globals.css";

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "On the Books — Real trades, on the record",
  description:
    "Free scheduling software for local trade pros — in exchange for one thing: proof. We verify licenses, insurance, and references against public records, then put your name on the town's register.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "On the Books — Real trades, on the record",
    description:
      "The municipal register of trusted local trades. License-verified pros, one boring, reliable record at a time.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1f16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${zillaSlab.variable} ${archivo.variable} ${ibmPlexMono.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-sm bg-mustard-500 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "On the Books",
              alternateName: "On the Books Municipal Registry",
              description:
                "Free scheduling software for local trade pros in exchange for verification, connecting verified tradespeople with customers.",
              url: "https://onthebooks.co",
              foundingDate: "2019",
            }),
          }}
        />
      </body>
    </html>
  );
}
