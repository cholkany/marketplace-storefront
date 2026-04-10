import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoryGrid } from "@/components/category-grid";
import {
  FeaturedListings,
  DealsSection,
  RecentListings,
} from "@/components/featured-listings";
import { Shield, Truck, MessageCircle, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-border">
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Secure Transactions</p>
              <p className="text-xs text-muted-foreground">Buyer protection</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Direct Chat</p>
              <p className="text-xs text-muted-foreground">Message sellers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Local Pickup</p>
              <p className="text-xs text-muted-foreground">Meet nearby</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Easy Payments</p>
              <p className="text-xs text-muted-foreground">Multiple options</p>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <CategoryGrid />

        {/* Hot Deals Section */}
        <DealsSection />

        {/* Featured Listings */}
        <FeaturedListings />

        {/* Promotional Banner */}
        <section className="py-8">
          <div className="bg-primary rounded-xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Start Selling Today
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Join thousands of sellers on Souq Market. List your items for free
              and reach millions of buyers in your area.
            </p>
            <button className="bg-background text-foreground px-8 py-3 rounded-lg font-medium hover:bg-background/90 transition-colors">
              Create Your First Listing
            </button>
          </div>
        </section>

        {/* Recent Listings */}
        <RecentListings />
      </main>

      <Footer />
    </div>
  );
}
