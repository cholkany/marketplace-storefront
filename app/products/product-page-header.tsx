"use client";

import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./filter-sidebar";

interface ProductPageHeaderProps {
  productCount: number;
}

export function ProductPageHeader({ productCount }: ProductPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">All Products</h1>
        <p className="text-sm text-muted-foreground">
          {productCount} items found
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
              <SheetDescription className="sr-only">
                Filter products by category, price, and condition
              </SheetDescription>
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
  );
}
