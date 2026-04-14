"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/cart-drawer";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between py-2 px-4 text-sm text-muted-foreground border-b border-border">
          <div className="flex items-center gap-4">
            <Link href="/sell" className="hover:text-primary transition-colors">Sell on Souq Market</Link>
            <span>|</span>
            <span>Help & Support</span>
          </div>
          <div className="flex items-center gap-4">
            <span>|</span>
            <span>Download App</span>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16 gap-4 px-4 border-b border-border">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 px-4">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
                <SheetDescription>Browse categories and navigate the site</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-primary">
                  Home
                </Link>
                <Link href="/products" className="text-lg font-medium hover:text-primary">
                  All Products
                </Link>
                <Link href="/messages" className="text-lg font-medium hover:text-primary">
                  Messages
                </Link>
                <Link href="/vendor" className="text-lg font-medium hover:text-primary">
                  Vendor Dashboard
                </Link>
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Categories</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/products?category=electronics" className="hover:text-primary">Electronics</Link>
                    <Link href="/products?category=fashion" className="hover:text-primary">Fashion</Link>
                    <Link href="/products?category=home" className="hover:text-primary">Home & Garden</Link>
                    <Link href="/products?category=sports" className="hover:text-primary">Sports</Link>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-primary rounded-sm px-3 py-1.5">
              <span className="font-serif font-bold text-xl text-primary-foreground">souq</span>
            </div>
            <div className="bg-secondary rounded-sm px-3 py-1.5">
              <span className="font-serif font-bold text-xl text-primary-foreground">market</span>
            </div>

          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for products, brands and more..."
                className="w-full pl-4 pr-12 h-11 bg-secondary border-none focus-visible:ring-primary"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 h-9 w-9"
              >
                <Search className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Messages */}
            <Link href="/messages" className="hidden md:flex">
              <Button variant="ghost" size="icon" className="relative">
                <MessageCircle className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  2
                </Badge>
              </Button>
            </Link>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative hidden md:flex" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                3
              </Badge>
            </Button>

            {/* User */}
            <Link href="/login" className="hidden md:flex">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Sell Button */}
            <Button className="hidden sm:flex bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              Start Selling
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-border">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-4 pr-12 bg-secondary border-none"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 h-8 w-8"
              >
                <Search className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </div>
        )}

        {/* Category Navigation */}
        <nav className="hidden md:flex items-center gap-6 h-12 text-sm px-4">
          <Link href="/products?category=electronics" className="hover:text-primary transition-colors">
            Electronics
          </Link>
          <Link href="/products?category=fashion" className="hover:text-primary transition-colors">
            Fashion
          </Link>
          <Link href="/products?category=home" className="hover:text-primary transition-colors">
            Home & Garden
          </Link>
          <Link href="/products?category=sports" className="hover:text-primary transition-colors">
            Sports
          </Link>
          <Link href="/products?category=beauty" className="hover:text-primary transition-colors">
            Beauty
          </Link>
          <Link href="/products" className="text-primary font-medium hover:underline">
            View All
          </Link>
        </nav>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
