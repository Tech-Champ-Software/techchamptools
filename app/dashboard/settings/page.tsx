import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isSupabaseConfigured } from "@/lib/supabase"
import { DEFAULT_SETTINGS } from "@/lib/types"
import { CheckCircle2, XCircle, ExternalLink, Database, MessageCircle, Search, FolderTree } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your store settings and connections
        </p>
      </div>

      {/* Supabase Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Connection
            {isSupabaseConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
            ) : (
              <XCircle className="h-5 w-5 text-amber-500 ml-auto" />
            )}
          </CardTitle>
          <CardDescription>
            {isSupabaseConfigured
              ? "Your database is connected and ready."
              : "Connect Supabase to manage real products and enable admin authentication."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupabaseConfigured ? (
            <div className="rounded-lg bg-muted p-4 space-y-4">
              <h4 className="font-medium">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                <li>
                  Create a Supabase project at{" "}
                  <Link
                    href="https://supabase.com"
                    target="_blank"
                    className="text-accent hover:underline inline-flex items-center gap-1"
                  >
                    supabase.com
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <strong>Create the products table</strong> - Go to SQL Editor and run:
                  <pre className="mt-2 bg-secondary p-3 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
{`CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Auth users can insert" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth users can update" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Auth users can delete" ON products
  FOR DELETE TO authenticated USING (true);`}
                  </pre>
                </li>
                <li>
                  <strong>Create Storage Bucket</strong> - Go to Storage, create a bucket named <code className="bg-secondary px-1 rounded">product-images</code> and make it <strong>Public</strong>
                </li>
                <li>
                  <strong>Set Storage Policies</strong> - In Storage Policies, add:
                  <pre className="mt-2 bg-secondary p-3 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap">
{`-- Public read
CREATE POLICY "Public view" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Auth upload/delete
CREATE POLICY "Auth upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Auth delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');`}
                  </pre>
                </li>
                <li>
                  <strong>Create Admin User</strong> - Go to Authentication &gt; Users &gt; Add user
                </li>
                <li>
                  <strong>Add Environment Variables</strong>:
                  <pre className="mt-2 bg-secondary p-3 rounded-lg text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`}
                  </pre>
                </li>
              </ol>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm">Connected to Supabase - Authentication and database active</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            WhatsApp Configuration
          </CardTitle>
          <CardDescription>
            Configure your WhatsApp number for receiving orders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Update your WhatsApp number and business details in <code className="bg-secondary px-1 rounded">lib/types.ts</code>:
            </p>
            <pre className="bg-secondary p-4 rounded-lg text-sm overflow-x-auto">
{`export const DEFAULT_SETTINGS = {
  whatsapp_number: "${DEFAULT_SETTINGS.whatsapp_number}",
  business_name: "${DEFAULT_SETTINGS.business_name}",
  currency: "${DEFAULT_SETTINGS.currency}",
  currency_symbol: "${DEFAULT_SETTINGS.currency_symbol}",
}`}
            </pre>
            <p className="text-sm text-muted-foreground">
              <strong>Format:</strong> Include country code without + sign (e.g., 919999999999 for +91)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO & Metadata
          </CardTitle>
          <CardDescription>
            Update your site title and description for better search visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Update your site metadata in <code className="bg-secondary px-1 rounded">app/layout.tsx</code>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Site title and description</li>
              <li>OpenGraph tags for social sharing</li>
              <li>Keywords for SEO</li>
              <li>Theme colors</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Files Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Project Structure
          </CardTitle>
          <CardDescription>
            Key files you may want to customize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <code className="text-muted-foreground">lib/types.ts</code>
              <span>WhatsApp number, business name, currency</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <code className="text-muted-foreground">lib/supabase.ts</code>
              <span>Database connection and SQL schema</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <code className="text-muted-foreground">lib/mock-data.ts</code>
              <span>Sample products (used without Supabase)</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <code className="text-muted-foreground">app/layout.tsx</code>
              <span>SEO metadata, fonts, theme</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <code className="text-muted-foreground">app/globals.css</code>
              <span>Color theme and design tokens</span>
            </div>
            <div className="flex justify-between">
              <code className="text-muted-foreground">components/header.tsx</code>
              <span>Logo and navigation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
