import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getAllProducts, getDealsProducts, getFeaturedProducts } from "@/lib/products";

export async function FeaturedListings() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold">Featured Listings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hand-picked by our team
          </p>
        </div>
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export async function DealsSection() {
  const deals = await getDealsProducts();

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            Hot Deals
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Limited time offers
          </p>
        </div>
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            See More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export async function RecentListings() {
  const allProducts = await getAllProducts();
  const recentProducts = allProducts.slice(0, 4); // Take first 4 as recent since there's no creation date field

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold">Recently Added</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fresh listings from sellers
          </p>
        </div>
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            Browse All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

