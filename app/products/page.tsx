import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { getAllProducts, categories } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function FilterSidebar() {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox id={category.id} />
              <Label htmlFor={category.id} className="text-sm cursor-pointer">
                {category.name}
                <span className="text-muted-foreground ml-1">
                  ({category.productCount})
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 1500]}
            max={2000}
            step={50}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="h-9"
              defaultValue={0}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Max"
              className="h-9"
              defaultValue={1500}
            />
          </div>
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-semibold mb-3">Condition</h3>
        <div className="space-y-2">
          {["New", "Like New", "Good", "Fair"].map((condition) => (
            <div key={condition} className="flex items-center gap-2">
              <Checkbox id={condition.toLowerCase().replace(" ", "-")} />
              <Label
                htmlFor={condition.toLowerCase().replace(" ", "-")}
                className="text-sm cursor-pointer"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Rating */}
      <div>
        <h3 className="font-semibold mb-3">Seller Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <Checkbox id={`rating-${rating}`} />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm cursor-pointer flex items-center gap-1"
              >
                {rating}+ Stars
                <span className="text-primary">{"★".repeat(rating)}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full bg-primary text-primary-foreground">
        Apply Filters
      </Button>
    </div>
  );
}

async function ProductsContent() {
  const products = await getAllProducts();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-4">
          <span className="hover:text-foreground cursor-pointer">Home</span>
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-serif text-2xl font-bold">All Products</h1>
                <p className="text-sm text-muted-foreground">
                  {products.length} items found
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="sm" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
<SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription className="sr-only">Filter products by category, price, and condition</SheetDescription>
                </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Best Rating</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border rounded-lg p-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

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
                className="bg-primary text-primary-foreground"
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

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
