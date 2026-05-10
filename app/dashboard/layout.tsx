import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag, Package, Settings, Home, LogOut } from "lucide-react"
import { AdminAuthProvider } from "@/components/admin-auth"
import { LogoutButton } from "@/components/logout-button"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your products and store settings",
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-border bg-card lg:flex">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <ShoppingBag className="h-6 w-6 text-accent" />
            <span className="font-serif text-lg font-semibold">Admin</span>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/products"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Products
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
          <div className="border-t border-border p-4 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              View Store
            </Link>
            <LogoutButton />
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-accent" />
              <span className="font-serif text-lg font-semibold">Admin</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/products"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Store
              </Link>
              <LogoutButton isMobile />
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-background p-6">{children}</main>
        </div>
      </div>
    </AdminAuthProvider>
  )
}
