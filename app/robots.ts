import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  // Update with your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourstore.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
