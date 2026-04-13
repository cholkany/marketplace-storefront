"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { medusaClient } from "@/lib/medusa";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Plus,
  Package,
  DollarSign,
  Settings,
  ExternalLink,
  Store,
  Pencil,
} from "lucide-react";

interface VendorShop {
  id: string;
  name: string;
  handle: string;
  category?: string;
  description?: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [shop, setShop] = useState<VendorShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Load vendor shop info and products in parallel
        const [shopRes, prodRes] = await Promise.all([
          medusaClient.client.fetch("/vendors/me", { method: "GET" }) as Promise<any>,
          medusaClient.client.fetch("/vendors/products", { method: "GET" }) as Promise<any>,
        ]);

        if (shopRes?.vendor) {
          setShop(shopRes.vendor);
        } else {
          // No shop yet — redirect to creation wizard
          router.replace("/vendor/create-shop");
          return;
        }

        setProducts(prodRes?.products || []);
      } catch (err: any) {
        const status = err?.status ?? err?.response?.status;
        if (status === 401 || status === 403) {
          router.push("/vendor/login");
          return;
        }
        // Backend route missing / network error — show error, don't boot user
        setLoadError(err?.message || "Could not connect to server. Is the Medusa backend running?");
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  return (

    <div className="flex-1 container mx-auto px-4 py-8">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and products</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/vendor/shop/edit">
              <Pencil className="h-4 w-4" /> Edit Shop
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/vendor/products/new">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {loadError && (
        <div className="mb-6 flex items-start gap-3 bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20">
          <span className="shrink-0">⚠</span>
          <div>
            <p className="font-medium">Could not load shop data</p>
            <p className="text-xs mt-0.5 opacity-80">{loadError}</p>
            <p className="text-xs mt-1 opacity-70">Make sure the Medusa backend is running and has been restarted to pick up new routes.</p>
          </div>
        </div>
      )}

      {/* Shop Info Card */}
      {shop && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Store className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-0.5">Your Shop</p>
            <h2 className="text-lg font-bold truncate">{shop.name}</h2>
            {shop.category && (
              <span className="text-xs text-muted-foreground">{shop.category}</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <a href={`/shop/${shop.handle}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> View Shop
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link href="/vendor/shop/edit">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-muted-foreground">Total Products</h3>
          </div>
          <p className="text-3xl font-bold">{isLoading ? "—" : products.length}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-muted-foreground">Sales</h3>
          </div>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Products</h2>
          <Button size="sm" asChild className="gap-2">
            <Link href="/vendor/products/new">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-6">Create your first product to start selling!</p>
              <Button asChild><Link href="/vendor/products/new">Create Product</Link></Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Product</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-4 font-medium flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-xs overflow-hidden relative">
                          {product.thumbnail ? (
                            <img src={product.thumbnail} alt={product.title} className="object-cover w-full h-full" />
                          ) : "No img"}
                        </div>
                        {product.title}
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-xs font-medium">
                          {product.status || "draft"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        ${product.variants?.[0]?.prices?.[0]?.amount || 0}
                      </td>
                      <td className="px-4 py-4">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
