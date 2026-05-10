// Product Types - These match the Supabase table structure you'll create
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
}

// Order item for WhatsApp message
export interface OrderItem {
  product: Product
  quantity: number
}

// Site settings - You can expand this for your admin dashboard
export interface SiteSettings {
  whatsapp_number: string
  business_name: string
  currency: string
  currency_symbol: string
}

// Default site settings - Update these with your actual values
export const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp_number: "918603204426", // Replace with your WhatsApp number (with country code, no +)
  business_name: "TechChampTools",
  currency: "INR",
  currency_symbol: "₹",
}
