"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import { DEFAULT_SETTINGS } from "@/lib/types"
import { generateSingleProductWhatsAppUrl } from "@/lib/whatsapp"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const { currency_symbol } = DEFAULT_SETTINGS

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleBuyNow = () => {
    const whatsappUrl = generateSingleProductWhatsAppUrl(
      product.name,
      quantity,
      product.price
    )
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  const totalPrice = product.price * quantity
  const isOutOfStock = product.stock === 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
              Featured
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-bold text-foreground">
              {currency_symbol}
              {product.price.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Description
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mt-6">
            <p className={`text-sm font-medium ${isOutOfStock ? "text-destructive" : "text-green-600"}`}>
              {isOutOfStock
                ? "Out of Stock"
                : product.stock <= 5
                ? `Only ${product.stock} left in stock!`
                : "In Stock"}
            </p>
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="mt-6">
              <label className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Quantity
              </label>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-r-none"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10 rounded-l-none"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: {currency_symbol}
                  {totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}

          {/* Buy Now Button */}
          <div className="mt-8">
            <Button
              size="lg"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto sm:min-w-[200px]"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Buy on WhatsApp
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">
              Click to open WhatsApp with your order details pre-filled.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-8">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Direct Contact</p>
              <p className="text-xs text-muted-foreground">Chat directly with us</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Quality Assured</p>
              <p className="text-xs text-muted-foreground">Premium products only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
