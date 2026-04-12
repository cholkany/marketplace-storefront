import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Store, TrendingUp, ShieldCheck } from "lucide-react";

export default function SellPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 w-full relative">
        <div className="bg-primary text-primary-foreground py-20 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              Become a Seller on Souq Market
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of vendors and start selling your products to millions of buyers worldwide. Setup is free and takes less than 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/vendor/signup">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 w-full sm:w-auto h-12 px-8 text-lg">
                  Start Selling Now
                </Button>
              </Link>
              <Link href="/vendor/login">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary w-full sm:w-auto h-12 px-8 text-lg">
                  Log in to your Store
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Sell with Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl border border-border text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Reach More Buyers</h3>
                <p className="text-muted-foreground">Access millions of daily visitors looking for products exactly like yours.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Secure Payments</h3>
                <p className="text-muted-foreground">Get paid fast and securely directly to your bank account with zero hassle.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Custom Storefront</h3>
                <p className="text-muted-foreground">Build your brand identity with customizable store pages and URLs.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
