import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { DEFAULT_SETTINGS } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency_symbol } = DEFAULT_SETTINGS

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-lg bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-semibold text-foreground">
          {currency_symbol}
          {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  )
}
