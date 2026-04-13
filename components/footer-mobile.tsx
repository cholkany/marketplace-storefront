"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Home, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart-drawer";

export function FooterMobile() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: "Home", icon: Home, href: "/" },
        { label: "Shop", icon: Search, href: "/products" },
        { label: "Deals", icon: Sparkles, href: "/products?deals=true" },
        { label: "Account", icon: User, href: "/account" },
    ];

    return (
        <>
            <footer className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-md border-t border-border z-[100] sm:hidden h-16 safe-area-bottom">
                <div className="flex justify-around items-center h-full max-w-md mx-auto px-4">
                    <Link
                        href="/"
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                            pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    <Link
                        href="/products"
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                            pathname === "/products" ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <Search className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Products</span>
                    </Link>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 w-full h-full text-muted-foreground hover:text-primary relative group"
                    >
                        <div className="relative">
                            <Heart className="w-5 h-5 transition-transform group-active:scale-90" />
                            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-background animate-in fade-in zoom-in duration-300">
                                3
                            </span>
                        </div>
                        <span className="text-[10px] font-medium">Cart</span>
                    </button>

                    <Link
                        href="/account"
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                            pathname === "/account" ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Account</span>
                    </Link>
                </div>
            </footer>

            {/* Cart Drawer handled globally via state to avoid nested sheet conflicts */}
            <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />

            {/* Spacing for the fixed footer to prevent content clipping */}
            <div className="h-16 sm:hidden" />
        </>
    );
}