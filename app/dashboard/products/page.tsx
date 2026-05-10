import { ProductsClient } from "@/components/products-client"
import { getProducts } from "@/lib/supabase"

export default async function ProductsPage() {
  const products = await getProducts()

  return <ProductsClient initialProducts={products} />
}
