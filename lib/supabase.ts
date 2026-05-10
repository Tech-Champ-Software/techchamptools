// Supabase Client Configuration
// Setup Instructions at the bottom of this file

import { createClient } from "@supabase/supabase-js"
import type { Product } from "./types"
import { unstable_noStore as noStore } from "next/cache"

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Create Supabase client only if configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!) 
  : null

// ============================================
// AUTH FUNCTIONS
// ============================================

export async function signInAdmin(email: string, password: string) {
  if (!supabase) {
    return { error: { message: "Supabase not configured" } }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOutAdmin() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getCurrentUser() {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ============================================
// PRODUCT FUNCTIONS (Public - Read Only)
// ============================================

export async function getProducts(): Promise<Product[]> {
  noStore()
  if (!supabase) {
    const { MOCK_PRODUCTS } = await import("./mock-data")
    return MOCK_PRODUCTS
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    const { MOCK_PRODUCTS } = await import("./mock-data")
    return MOCK_PRODUCTS
  }

  return data || []
}

export async function getFeaturedProducts(): Promise<Product[]> {
  noStore()
  if (!supabase) {
    const { MOCK_PRODUCTS } = await import("./mock-data")
    return MOCK_PRODUCTS.filter((p) => p.featured)
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching featured products:", error)
    const { MOCK_PRODUCTS } = await import("./mock-data")
    return MOCK_PRODUCTS.filter((p) => p.featured)
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  noStore()
  if (!supabase) {
    const { MOCK_PRODUCTS } = await import("./mock-data")
    return MOCK_PRODUCTS.find((p) => p.id === id) || null
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!supabase) {
    const { MOCK_PRODUCTS } = await import("./mock-data")
    return MOCK_PRODUCTS.filter((p) => p.category === category)
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products by category:", error)
    return []
  }

  return data || []
}

// ============================================
// ADMIN FUNCTIONS (Require Authentication)
// ============================================

export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
): Promise<{ data: Product | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase not configured" }
  }

  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single()

  if (error) {
    console.error("Error creating product:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<{ data: Product | null; error: string | null }> {
  if (!supabase) {
    return { data: null, error: "Supabase not configured" }
  }

  const { data, error } = await supabase
    .from("products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating product:", error)
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase not configured" }
  }

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return { error: error.message }
  }

  return { error: null }
}

// ============================================
// IMAGE UPLOAD FUNCTIONS
// ============================================

export async function uploadProductImage(
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) {
    return { url: null, error: "Supabase not configured" }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file)

  if (uploadError) {
    console.error("Error uploading image:", uploadError)
    return { url: null, error: uploadError.message }
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)

  return { url: data.publicUrl, error: null }
}

export async function deleteProductImage(imageUrl: string): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: "Supabase not configured" }
  }

  // Extract file path from URL
  const urlParts = imageUrl.split("/product-images/")
  if (urlParts.length < 2) {
    return { error: "Invalid image URL" }
  }

  const filePath = urlParts[1]

  const { error } = await supabase.storage.from("product-images").remove([filePath])

  if (error) {
    console.error("Error deleting image:", error)
    return { error: error.message }
  }

  return { error: null }
}

/*
============================================
SUPABASE SETUP INSTRUCTIONS
============================================

1. Go to https://supabase.com and create a new project

2. Go to SQL Editor and run this SQL:

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can READ products (public storefront)
CREATE POLICY "Public can view products" ON products
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can INSERT products
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can UPDATE products
CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can DELETE products
CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_category ON products(category);

3. Create a Storage Bucket for product images:
   - Go to Storage in Supabase dashboard
   - Click "New bucket"
   - Name it: product-images
   - Make it PUBLIC (so images can be displayed on your site)
   - Click "Create bucket"

4. Set Storage Policies (in Storage > Policies):

-- Anyone can view images (for displaying on site)
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Only authenticated users can upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Only authenticated users can delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

5. Create an Admin User:
   - Go to Authentication > Users
   - Click "Add user" > "Create new user"
   - Enter your email and a strong password
   - This will be your admin login

6. Get your API keys:
   - Go to Settings > API
   - Copy "Project URL" and "anon public" key

7. Add environment variables to your project:
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

*/
