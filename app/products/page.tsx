import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our complete collection of quality products. Order via WhatsApp for a personal shopping experience.",
}

export const revalidate = 60 // Revalidate every 60 seconds

export default async function ProductsPage() {
  const products = await getProducts()

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border bg-secondary/20 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              All Products
            </h1>
            <p className="mt-2 text-muted-foreground">
              {products.length} products available
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {categories.map((category) => {
              const categoryProducts = products.filter((p) => p.category === category)
              return (
                <div key={category} className="mb-12 last:mb-0">
                  <h2 className="text-xl font-semibold text-foreground border-b border-border pb-4 mb-6">
                    {category}
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({categoryProducts.length})
                    </span>
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })}

            {products.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">
                  No products available at the moment.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
