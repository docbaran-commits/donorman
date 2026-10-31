import type { Metadata, Viewport } from "next"
import { Fraunces, IBM_Plex_Sans } from "next/font/google"
import Script from "next/script"

import { PwaRegister } from "@/components/pwa-register"
import { ViewportHeight } from "@/components/viewport-height"

import "./globals.css"

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

const viewportBoot = `
try {
  var sync = function () {
    var vv = window.visualViewport;
    var h = Math.round((vv && vv.height) || window.innerHeight || 0);
    var t = Math.round((vv && vv.offsetTop) || 0);
    if (h > 0) document.documentElement.style.setProperty("--app-height", h + "px");
    document.documentElement.style.setProperty("--app-top", t + "px");
  };
  sync();
  window.addEventListener("resize", sync);
  window.addEventListener("orientationchange", sync);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", sync);
    window.visualViewport.addEventListener("scroll", sync);
  }
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
      className={`${plexSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-dvh text-[16px] leading-snug tracking-[0.01em]">
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <Script id="viewport-boot" strategy="beforeInteractive">
          {viewportBoot}
        </Script>
        <ViewportHeight />
        {children}
        <PwaRegister />
      </body>
    </html>
  )
}
