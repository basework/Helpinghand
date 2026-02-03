import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PageShell from "@/components/PageShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Helping Hands",
  description:
    "Helping Hands is a financial & earning app that offers weekly cash rewards to new users",
  manifest: "/manifest.json",
  generator: "v0.dev",
  other: {
    "8c56abd733d73550a5527a8ac0c7bc62642d1a86": "8c56abd733d73550a5527a8ac0c7bc62642d1a86",
  },
  openGraph: {
    title: "Helping Hands",
    description:
      "Helping Hands is a financial & earning app that offers weekly cash rewards to new users",
    url: "https://helpinghands.money",
    siteName: "Helping Hands",
    images: [
      {
        url: "https://helpinghands.money/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Helping Hands",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Helping Hands",
    description:
      "Helping Hands is a financial & earning app that offers weekly cash rewards to new users",
    images: ["https://helpinghands.money/placeholder-logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ea580c" />
        {/* HilltopAds zone script - placed in head for reliable async loading */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(uz){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = uz || {};
s.src = "//tautshake.com/bxX.V/sDdqG/lf0LY/W/cM/Me/mr9FurZvUylKk/PiTaYP3/N/jWk/w_OOD/E_txN/jbcg2VOVTPAa4uNAQL";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <PageShell exclude={["/dashboard"]}>
            <main className="min-h-screen max-w-md mx-auto relative overflow-hidden">
              {children}
            </main>
          </PageShell>
        </ThemeProvider>
      </body>
    </html>
  )
}