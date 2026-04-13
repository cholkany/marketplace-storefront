"use client";

import { categories } from "@/lib/products";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function FilterSidebar() {
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
