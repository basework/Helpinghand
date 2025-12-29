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
  // Per-route metadata handled in each route's head.tsx to avoid conflicts
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
