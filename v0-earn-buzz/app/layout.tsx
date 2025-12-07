import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tivexx 9Ja",
  description:
    "Tivexx 9ja is a financial & earning app that offers weekly cash rewards to new users",
  manifest: "/manifest.json",
  generator: "v0.dev",
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
        <Script
          src="https://www.effectivegatecpm.com/ss7byyvk?key=1948aa06d1b260e8127ecf7f05d7529c"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <main className="min-h-screen max-w-md mx-auto bg-[#fff5f0]">{children}</main>

          {/* Ad container: vendor loader may inject here; fallback iframe added below if loader doesn't run */}
          <div id="effectivegatecpm-ad-container" className="mx-auto my-4" />

          <Script id="effectivegatecpm-inline" strategy="afterInteractive">
{`  atOptions = {
   	'key' : 'ef78ec2b2aca683b44ddc18ec141b160',
   	'format' : 'iframe',
   	'height' : 300,
   	'width' : 160,
   	'params' : {}
  };

  // Fallback: if vendor loader doesn't inject an ad into #effectivegatecpm-ad-container,
  // create a simple iframe pointing to the provided ad URL so you can verify placement.
  (function () {
    try {
      var container = document.getElementById('effectivegatecpm-ad-container');
      if (!container) return;
      // If vendor created content already, do nothing
      if (container.children.length > 0) return;
      var iframe = document.createElement('iframe');
      iframe.width = atOptions.width || 160;
      iframe.height = atOptions.height || 300;
      iframe.style.border = '0';
      iframe.style.display = 'block';
      iframe.style.margin = '0 auto';
      // Use the same URL used in the header/loader as a direct iframe fallback
      iframe.src = 'https://www.effectivegatecpm.com/ss7byyvk?key=1948aa06d1b260e8127ecf7f05d7529c';
      container.appendChild(iframe);
    } catch (e) {
      // swallow errors to avoid breaking page
      console.error('ad fallback error', e);
    }
  })();
`}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  )
}
