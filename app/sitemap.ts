import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL - Update this with your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourstore.com"

  // Get all products for dynamic routes
  const products = await getProducts()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}
