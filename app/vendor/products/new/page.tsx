"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { medusaClient } from "@/lib/medusa";
import { productSchema } from "@/lib/schema";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PackagePlus } from "lucide-react";

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewVendorProduct() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const priceAmount = parseFloat(data.price);
      
      const payload = {
        title: data.title,
        description: data.description,
        status: "published",
        options: [
          {
            title: "Default",
            values: ["Default"]
          }
        ],
        variants: [
          {
            title: "Default Variant",
            manage_inventory: true,
            inventory_quantity: 1,
            options: {
              Default: "Default"
            },
            prices: [
              {
                amount: priceAmount,
                currency_code: "usd", // default assumption for MVP
              }
            ]
          }
        ]
      };

      await medusaClient.client.fetch("/vendors/products", {
        method: "POST",
        body: payload as any
      });

      router.push("/vendor/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/vendor/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Link>
          
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <PackagePlus className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-serif">Add New Product</h1>
                <p className="text-muted-foreground text-sm">List an item for sale in your store</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-md border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register("price")}
                    className={`pl-7 ${errors.price ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe your product in detail..."
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Link href="/vendor/dashboard">
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Publishing..." : "Publish Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
