"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { medusaClient } from "@/lib/medusa";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  BadgeCheck,
  LayoutGrid,
  LayoutList,
  MessageSquare,
  Package,
  SlidersHorizontal,
  Store,
  ShoppingBag,
  Heart,
  ArrowRight,
  StarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorShop {
  id: string;
  name: string;
  handle: string;
  logo?: string;
  description?: string;
  category?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  return_policy?: string;
  shipping_policy?: string;
  privacy_policy?: string;
  // Future: rating/review fields
  rating?: number;
  review_count?: number;
  verified?: boolean;
  member_since?: string;
}

interface ShopProduct {
  id: string;
  title: string;
  thumbnail?: string;
  variants?: Array<{ prices?: Array<{ amount: number }> }>;
  status?: string;
}

interface OtherShop {
  id: string;
  name: string;
  handle: string;
  logo?: string;
  category?: string;
  rating?: number;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function ProductPrice({ product }: { product: ShopProduct }) {
  const amount = product.variants?.[0]?.prices?.[0]?.amount ?? 0;
  if (!amount) return <span className="text-muted-foreground text-xs">Price on request</span>;
  return <span className="font-bold text-primary">${amount}</span>;
}

function ProductGrid({ products }: { products: ShopProduct[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/products/${p.id}`}
          className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all"
        >
          <div className="aspect-square bg-muted relative overflow-hidden">
            {p.thumbnail ? (
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, 25vw"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
            <button
              className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              onClick={(e) => e.preventDefault()}
              aria-label="Add to wishlist"
            >
              <Heart className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
              {p.title}
            </h3>
            <ProductPrice product={p} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProductListView({ products }: { products: ShopProduct[] }) {
  return (
    <div className="space-y-3">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/products/${p.id}`}
          className="group flex gap-4 bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all p-3"
        >
          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden relative shrink-0">
            {p.thumbnail ? (
              <Image
                src={p.thumbnail}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="80px"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {p.title}
            </h3>
            <Badge variant="secondary" className="text-xs capitalize mb-2">
              {p.status || "published"}
            </Badge>
            <ProductPrice product={p} />
          </div>
        </Link>
      ))}
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-56 rounded-none" />
      <div className="container mx-auto px-4">
        <div className="flex gap-4 -mt-12 mb-6">
          <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2 pt-12">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPublicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [shop, setShop] = useState<VendorShop | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [otherShops, setOtherShops] = useState<OtherShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [notFound, setNotFound] = useState(false);

  const loadShop = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch the specific vendor by handle directly
      const res = (await medusaClient.client.fetch(
        `/vendors?handle=${encodeURIComponent(slug)}`,
        { method: "GET" }
      )) as any;

      const vendors: VendorShop[] = res.vendors || [];
      // Backend filters by handle, but fall back to id match too
      const found = vendors[0] ?? null;

      if (!found) {
        setNotFound(true);
        return;
      }

      setShop(found);

      // Load shop products and other shops in parallel
      const [prodRes, allRes] = await Promise.allSettled([
        medusaClient.client.fetch(`/vendors/${found.id}/products`, { method: "GET" }),
        medusaClient.client.fetch("/vendors", { method: "GET" }),
      ]);

      if (prodRes.status === "fulfilled") {
        setProducts((prodRes.value as any).products || []);
      }

      if (allRes.status === "fulfilled") {
        const all: VendorShop[] = (allRes.value as any).vendors || [];
        setOtherShops(all.filter((v) => v.id !== found.id).slice(0, 4));
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);


  useEffect(() => {
    loadShop();
  }, [loadShop]);

  const sortedProducts = [...products].sort((a, b) => {
    const aPrice = a.variants?.[0]?.prices?.[0]?.amount ?? 0;
    const bPrice = b.variants?.[0]?.prices?.[0]?.amount ?? 0;
    if (sortOrder === "price-asc") return aPrice - bPrice;
    if (sortOrder === "price-desc") return bPrice - aPrice;
    return 0;
  });

  if (isLoading) return (
    <ShopSkeleton />
  );

  if (notFound || !shop) {
    return (

      <div className="flex-1 flex items-center justify-center flex-col gap-4 py-24">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <Store className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-serif">Shop Not Found</h1>
        <p className="text-muted-foreground">
          The shop you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">Browse Marketplace</Link>
        </Button>
      </div>
    );
  }

  // Flatten shop fields for easy template access
  const rating = shop.rating ?? 4.5;
  const reviewCount = shop.review_count ?? 0;
  const verified = shop.verified ?? false;
  const memberSince = shop.member_since ?? new Date().getFullYear().toString();

  return (

    <>
      {/* ── BANNER ── */}
      <div className="relative w-full h-52 sm:h-64 bg-gradient-to-br from-primary/20 via-accent/30 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="opacity-10">
            <ShoppingBag className="h-32 w-32 text-primary" />
          </div>
        </div>
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── SHOP HEADER ── */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col sm:flex-row gap-5 -mt-12 mb-6 relative z-10">
          {/* Logo */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-background bg-card shadow-lg overflow-hidden shrink-0 relative">
            {shop.logo ? (
              <Image
                src={shop.logo}
                alt={`${shop.name} logo`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Store className="h-10 w-10 text-primary" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 sm:pt-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold font-serif">{shop.name}</h1>
                  {verified && (
                    <BadgeCheck
                      className="h-6 w-6 text-blue-500 shrink-0"
                      aria-label="Verified seller"
                    />
                  )}
                  {shop.category && (
                    <Badge variant="secondary" className="text-xs">
                      {shop.category}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center flex-wrap gap-4 mt-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-3.5 w-3.5",
                          star <= Math.round(rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                    <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
                    {reviewCount > 0 && (
                      <span className="text-muted-foreground">({reviewCount} reviews)</span>
                    )}
                  </div>
                  {(shop.city || shop.country) && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {[shop.city, shop.country].filter(Boolean).join(", ")}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </div>
                  <span>Member since {memberSince}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {shop.contact_email && (
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <Link href={`/messages?vendor=${shop.id}`}>
                      <MessageSquare className="h-4 w-4" />
                      Contact Seller
                    </Link>
                  </Button>
                )}
                <Button size="sm" asChild>
                  <Link href={`#products`}>
                    <StarIcon className="h-4 w-4 mr-2" />
                    Rate Shop
                  </Link>
                </Button>
              </div>
            </div>

            {/* Social Links */}
            {(shop.instagram || shop.twitter || shop.facebook || shop.website) && (
              <div className="flex items-center gap-3 mt-3">
                {shop.instagram && (
                  <a
                    href={`https://instagram.com/${shop.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {shop.twitter && (
                  <a
                    href={`https://twitter.com/${shop.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {shop.facebook && (
                  <a
                    href={shop.facebook.startsWith("http") ? shop.facebook : `https://${shop.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {shop.website && (
                  <a
                    href={shop.website.startsWith("http") ? shop.website : `https://${shop.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Website"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <Tabs defaultValue="products" className="mt-2">
          <TabsList className="mb-6 bg-muted/60 p-1 rounded-xl h-auto">
            <TabsTrigger value="products" className="rounded-lg px-5">
              Products
            </TabsTrigger>
            <TabsTrigger value="about" className="rounded-lg px-5">
              About
            </TabsTrigger>
            <TabsTrigger value="policies" className="rounded-lg px-5">
              Policies
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg px-5">
              Reviews
              {reviewCount > 0 && (
                <Badge className="ml-1.5 text-xs h-5 px-1.5">{reviewCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" id="products">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <p className="text-sm text-muted-foreground">
                {sortedProducts.length} products found
              </p>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-2 py-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOption)}
                    className="text-sm bg-transparent border-none focus:outline-none cursor-pointer pr-1"
                    aria-label="Sort products"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    aria-label="List view"
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-2xl">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-lg mb-1">No products yet</h3>
                <p className="text-muted-foreground text-sm">
                  This shop hasn&apos;t listed any products yet. Check back soon!
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <ProductListView products={sortedProducts} />
            )}
          </TabsContent>

          {/* ABOUT TAB */}
          <TabsContent value="about">
            <div className="max-w-2xl space-y-6">
              {shop.description && (
                <div>
                  <h2 className="font-bold text-lg mb-3">About Us</h2>
                  <p className="text-muted-foreground leading-relaxed">{shop.description}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {shop.contact_email && (
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${shop.contact_email}`}
                        className="text-sm font-medium hover:text-primary transition-colors truncate block"
                      >
                        {shop.contact_email}
                      </a>
                    </div>
                  </div>
                )}
                {shop.contact_phone && (
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a
                        href={`tel:${shop.contact_phone}`}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {shop.contact_phone}
                      </a>
                    </div>
                  </div>
                )}
                {(shop.city || shop.country) && (
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">
                        {[shop.address, shop.city, shop.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                {shop.website && (
                  <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Website</p>
                      <a
                        href={shop.website.startsWith("http") ? shop.website : `https://${shop.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors truncate block"
                      >
                        {shop.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* POLICIES TAB */}
          <TabsContent value="policies">
            <div className="max-w-2xl space-y-6">
              {[
                { key: "return_policy" as const, title: "Return Policy" },
                { key: "shipping_policy" as const, title: "Shipping Policy" },
                { key: "privacy_policy" as const, title: "Privacy Policy" },
              ].map(({ key, title }) => {
                const text = shop[key];
                if (!text) return null;
                return (
                  <div key={key} className="bg-card border border-border rounded-xl p-5">
                    <h3 className="font-bold mb-3">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                      {text}
                    </p>
                  </div>
                );
              })}

              {!shop.return_policy && !shop.shipping_policy && !shop.privacy_policy && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No policies have been set by this shop yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* REVIEWS TAB */}
          <TabsContent value="reviews">
            <div className="max-w-2xl">
              {/* Rating Summary */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center shrink-0">
                  <div className="text-5xl font-bold text-primary">{rating.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-5 w-5",
                          star <= Math.round(rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </p>
                </div>
                {/* Rating bars */}
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-muted-foreground">{star}</span>
                      <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: star === Math.round(rating) ? "60%" : star === 5 ? "30%" : "10%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {reviewCount === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-2xl">
                  <Star className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-1">No reviews yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Be the first to buy from this shop and leave a review!
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Reviews coming soon.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* ── EXPLORE MORE SHOPS ── */}
        {otherShops.length > 0 && (
          <section className="mt-16 mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold font-serif">Explore More Shops</h2>
              <Button variant="ghost" size="sm" asChild className="text-primary gap-1">
                <Link href="/shops">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {otherShops.map((s) => (
                <Link
                  key={s.id}
                  href={`/shop/${s.handle}`}
                  className="group bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition-all hover:border-primary/30"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 overflow-hidden relative">
                    {s.logo ? (
                      <Image
                        src={s.logo}
                        alt={s.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <Store className="h-7 w-7 text-primary/60" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {s.name}
                  </h3>
                  {s.category && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {s.category}
                    </p>
                  )}
                  {s.rating && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-xs font-medium">{s.rating.toFixed(1)}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
