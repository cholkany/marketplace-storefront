import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getProductById,
  getProductsByCategory,
  getAllProducts,
} from "@/lib/products";
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Shield,
  MessageCircle,
  Clock,
  Check,
  ChevronRight,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProductsList = await getProductsByCategory(product.category);
  const relatedProducts = relatedProductsList
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    )
    : 0;

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 inline mx-2" />
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-3 w-3 inline mx-2" />
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-foreground capitalize"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3 inline mx-2" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  -{discount}% OFF
                </Badge>
              )}
              {product.condition === "new" && (
                <Badge variant="secondary" className="px-3 py-1">
                  Brand New
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`w-20 h-20 rounded-lg bg-muted overflow-hidden border-2 ${i === 1 ? "border-primary" : "border-transparent"
                  } hover:border-primary transition-colors relative`}
              >
                <Image
                  src={product.images[0]}
                  alt={`${product.name} thumbnail ${i}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Actions */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-balance">
                {product.name}
              </h1>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  You save ${product.originalPrice! - product.price}
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                {product.seller.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{product.seller.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {product.seller.rating} Rating
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {product.seller.location}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {product.seller.memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="grid grid-cols-2 gap-2">
              {product.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Condition & Stock */}
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="capitalize">{product.condition} Condition</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{product.stock} in stock</span>
            </div>
          </div>

          <Separator />

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href={`/messages?seller=${product.seller.id}&product=${product.id}`} className="block">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-semibold gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Contact Seller to Arrange Pickup
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" className="h-12">
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="h-12 gap-2">
                <Heart className="h-4 w-4" />
                Save for Later
              </Button>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-primary/10 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-primary mb-2">
              Safety Tips for Buyers
            </h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Meet in a safe, public location</li>
              <li>• Inspect the item before payment</li>
              <li>• Use secure payment methods</li>
              <li>• Trust your instincts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-8 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold">
              Similar Products
            </h2>
            <Link
              href={`/products?category=${product.category}`}
              className="text-sm text-primary font-medium hover:underline"
            >
              View More
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (err) {
    return [];
  }
}
