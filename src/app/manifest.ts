import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DonorMan",
    short_name: "DonorMan",
    description:
      "Predicted heart mass matching for donor and recipient sizing in heart transplantation.",
    id: "./",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#f3efe6",
    theme_color: "#f3efe6",
    lang: "en",
    categories: ["medical", "utilities"],
    icons: [
      {
        src: "icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
