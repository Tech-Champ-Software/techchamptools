"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search, Upload, X, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Product } from "@/lib/types"
import { DEFAULT_SETTINGS } from "@/lib/types"
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  isSupabaseConfigured,
} from "@/lib/supabase"

interface ProductFormProps {
  formData: {
    name: string
    description: string
    price: string
    image: string
    category: string
    stock: string
    featured: boolean
  }
  onFieldChange: (field: string, value: string | boolean) => void
  onImageUpload: (file: File) => Promise<void>
  isUploading: boolean
  currencySymbol: string
}

function ProductForm({
  formData,
  onFieldChange,
  onImageUpload,
  isUploading,
  currencySymbol,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onImageUpload(file)
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="Enter product name"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Enter product description"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price ({currencySymbol})</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => onFieldChange("price", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => onFieldChange("stock", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => onFieldChange("category", e.target.value)}
          placeholder="e.g., Home Decor"
        />
      </div>
      <div className="grid gap-2">
        <Label>Product Image</Label>
        <div className="space-y-3">
          {formData.image && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-secondary">
              <Image
                src={formData.image}
                alt="Product preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onFieldChange("image", "")}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Or enter image URL directly:
          </p>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => onFieldChange("image", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => onFieldChange("featured", checked)}
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>
    </div>
  )
}

interface ProductsClientProps {
  initialProducts: Product[]
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { currency_symbol } = DEFAULT_SETTINGS

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    stock: "",
    featured: false,
  })

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)

    const { url, error } = await uploadProductImage(file)

    if (error) {
      setError(`Image upload failed: ${error}`)
    } else if (url) {
      setFormData((prev) => ({ ...prev, image: url }))
    }

    setIsUploading(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category: "",
      stock: "",
      featured: false,
    })
    setError(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
    })
    setError(null)
    setIsEditDialogOpen(true)
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Product name is required")
      return false
    }
    if (!formData.description.trim()) {
      setError("Description is required")
      return false
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price")
      return false
    }
    if (!formData.image.trim()) {
      setError("Product image is required")
      return false
    }
    if (!formData.category.trim()) {
      setError("Category is required")
      return false
    }
    return true
  }

  const handleSaveEdit = async () => {
    if (!editingProduct || !validateForm()) return

    setIsSubmitting(true)
    setError(null)

    const updates = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      featured: formData.featured,
    }

    if (isSupabaseConfigured) {
      const { data, error } = await updateProduct(editingProduct.id, updates)

      if (error) {
        setError(error)
        setIsSubmitting(false)
        return
      }

      if (data) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? data : p)))
      }
    } else {
      // Local state update for demo
      const updatedProduct = {
        ...editingProduct,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)))
    }

    setEditingProduct(null)
    setIsEditDialogOpen(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleAddProduct = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)

    const newProductData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      featured: formData.featured,
    }

    if (isSupabaseConfigured) {
      const { data, error } = await createProduct(newProductData)

      if (error) {
        setError(error)
        setIsSubmitting(false)
        return
      }

      if (data) {
        setProducts([data, ...products])
      }
    } else {
      // Local state update for demo
      const newProduct: Product = {
        ...newProductData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setProducts([newProduct, ...products])
    }

    setIsAddDialogOpen(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    if (isSupabaseConfigured) {
      const { error } = await deleteProduct(id)

      if (error) {
        alert(`Failed to delete: ${error}`)
        return
      }
    }

    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}
            <ProductForm
              formData={formData}
              onFieldChange={handleFieldChange}
              onImageUpload={handleImageUpload}
              isUploading={isUploading}
              currencySymbol={currency_symbol}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddProduct} disabled={isSubmitting || isUploading}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connection Status */}
      {!isSupabaseConfigured && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <p className="font-medium">Demo Mode</p>
          <p>Supabase is not connected. Changes will not be saved permanently.</p>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setEditingProduct(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <ProductForm
            formData={formData}
            onFieldChange={handleFieldChange}
            onImageUpload={handleImageUpload}
            isUploading={isUploading}
            currencySymbol={currency_symbol}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveEdit} disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{product.name}</p>
                      {product.featured && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-sm">
                      <span className="font-medium">
                        {currency_symbol}
                        {product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-muted-foreground"> · Stock: {product.stock}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                {searchQuery
                  ? "No products found matching your search."
                  : "No products yet. Add your first product!"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
