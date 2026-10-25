import type { Metadata, Viewport } from "next"
import { Fraunces, Source_Sans_3 } from "next/font/google"
import Script from "next/script"

import { PwaRegister } from "@/components/pwa-register"

import "./globals.css"

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
})

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
})

const themeBoot = `
try {
  document.documentElement.classList.remove("dark");
} catch (e) {}
`

export const metadata: Metadata = {
  title: "DonorMan",
  description:
    "Predicted heart mass matching for donor and recipient sizing in heart transplantation.",
  applicationName: "DonorMan",
  appleWebApp: {
    capable: true,
    title: "DonorMan",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  interactiveWidget: "resizes-content",
  themeColor: "#f3efe6",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        {children}
        <PwaRegister />
      </body>
    </html>
  )
}
