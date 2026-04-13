import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { getAllProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Grid3X3, List, X } from "lucide-react";
import { ProductPageHeader } from "./product-page-header";
import { FilterSidebar } from "./filter-sidebar";

async function ProductsContent() {
  const products = await getAllProducts();

  return (

    <main className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground cursor-pointer">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">All Products</span>
      </nav>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-card rounded-lg border border-border p-4">
            <h2 className="font-serif text-lg font-bold mb-4">Filters</h2>
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header (Client Component with Filters & Sort) */}
          <ProductPageHeader productCount={products.length} />

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full text-sm">
              Electronics
              <button className="ml-1 hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-full text-sm">
              $0 - $1500
              <button className="ml-1 hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </div>
            <button className="text-sm text-primary hover:underline">
              Clear all
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-primary-foreground border-primary"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>

  );
}

// Helper to make the main page code cleaner
import Link from "next/link";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-6 flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground font-serif text-xl">
            Discovering Products...
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
