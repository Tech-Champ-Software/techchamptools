import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/supabase"

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="max-w-xl">
                <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                  Quality products, personal service
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
                  Discover our curated collection of premium products. Order directly via WhatsApp for a seamless, personal shopping experience.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/products">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Browse Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src="/techchamptools.jpg"
                    alt="Curated products collection"
                    fill
                    className="object-top-right object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-48 rounded-xl bg-card p-4 shadow-lg">
                  <p className="text-sm font-medium text-foreground">Order via WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Direct chat, no hassle</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Featured Products
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Our most popular items, handpicked for you
                </p>
              </div>
              <Link
                href="/products"
                className="hidden text-sm font-medium text-accent hover:text-accent/80 transition-colors sm:flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link href="/products">
                <Button variant="outline">
                  View all products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-border bg-secondary/20 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How It Works
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                Simple, direct, and personal shopping experience
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <span className="text-xl font-semibold">1</span>
                </div>
                <h3 className="mt-4 font-medium text-foreground">Browse Products</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explore our curated collection and find what you love
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <span className="text-xl font-semibold">2</span>
                </div>
                <h3 className="mt-4 font-medium text-foreground">Select & Order</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose quantity and click the WhatsApp button
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <span className="text-xl font-semibold">3</span>
                </div>
                <h3 className="mt-4 font-medium text-foreground">Chat & Confirm</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Finalize your order directly with us on WhatsApp
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
              <h2 className="font-serif text-2xl font-semibold text-primary-foreground sm:text-3xl text-balance">
                Ready to explore our collection?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
                Browse our products and order via WhatsApp for a personal shopping experience.
              </p>
              <Link href="/products" className="mt-8 inline-block">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
