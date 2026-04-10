import { medusaClient } from "./medusa";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  seller: {
    id: string;
    name: string;
    location: string;
    rating: number;
    memberSince: string;
  };
  images: string[];
  condition: "new" | "like-new" | "good" | "fair";
  features: string[];
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "📱", productCount: 1250 },
  { id: "fashion", name: "Fashion", icon: "👕", productCount: 3420 },
  { id: "home", name: "Home & Garden", icon: "🏠", productCount: 890 },
  { id: "sports", name: "Sports", icon: "⚽", productCount: 560 },
  { id: "beauty", name: "Beauty", icon: "💄", productCount: 720 },
  { id: "automotive", name: "Automotive", icon: "🚗", productCount: 340 },
  { id: "kids", name: "Kids & Baby", icon: "🧸", productCount: 480 },
  { id: "books", name: "Books & Media", icon: "📚", productCount: 920 },
];

function mapMedusaProduct(p: any): Product {
  // Try to find the cheapest variant price
  const priceOptions = p.variants?.flatMap((v: any) => v.prices?.map((pr: any) => pr.amount)) || [];
  const price = priceOptions.length > 0 ? Math.min(...priceOptions) : 0; // Notice storefront-best-practices says DO NOT divide prices by 100 for Medusa

  return {
    id: p.id,
    name: p.title,
    price: price,
    originalPrice: p.metadata?.originalPrice || price * 1.2,
    description: p.description || "",
    category: p.collection?.handle || "general",
    seller: {
      id: p.metadata?.seller_id || "s1",
      name: p.metadata?.seller_name || "Medusa Market Seller",
      location: p.metadata?.seller_location || "Global, Earth",
      rating: p.metadata?.seller_rating || 4.5,
      memberSince: p.metadata?.seller_memberSince || "2023",
    },
    images: (p.images || []).map((img: any) => img.url).length > 0 ? (p.images || []).map((img: any) => img.url) : ["/products/headphones.jpg"],
    condition: p.metadata?.condition || "new",
    features: p.metadata?.features || ["Fast Shipping", "Secure Payment", "Quality Assured", "24/7 Support"],
    stock: p.variants?.reduce((sum: number, v: any) => sum + (v.inventory_quantity || 0), 0) || 10,
  };
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const { product } = (await medusaClient.client.fetch(`/store/products/${id}`)) as any;
    if (product) {
      return mapMedusaProduct(product);
    }
  } catch (e) {
    console.error(e);
  }
  return undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { products } = (await medusaClient.client.fetch(`/store/products`, {
      method: "GET",
      query: { collection_id: [category] }
    })) as any;
    return products.map(mapMedusaProduct);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    // using query logic that returns products from the store using generic properties
    // fetch up to 4 for featured
    const { products } = (await medusaClient.client.fetch(`/store/products`, {
      method: "GET",
      query: { limit: 4 }
    })) as any;
    return products.map(mapMedusaProduct);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getDealsProducts(): Promise<Product[]> {
  try {
    // using query logic that returns products from the store using generic properties
    // fetch up to 4 for deals
    const { products } = (await medusaClient.client.fetch(`/store/products`, {
      method: "GET",
      query: { limit: 4, offset: 4 }
    })) as any;
    return products.map(mapMedusaProduct);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { products } = (await medusaClient.client.fetch(`/store/products`, {
      method: "GET"
    })) as any;
    return products.map(mapMedusaProduct);
  } catch (e) {
    console.error(e);
    return [];
  }
}
