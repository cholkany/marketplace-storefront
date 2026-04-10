import Link from "next/link";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";
import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  Car,
  Baby,
  BookOpen,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  electronics: <Smartphone className="h-6 w-6" />,
  fashion: <Shirt className="h-6 w-6" />,
  home: <Home className="h-6 w-6" />,
  sports: <Dumbbell className="h-6 w-6" />,
  beauty: <Sparkles className="h-6 w-6" />,
  automotive: <Car className="h-6 w-6" />,
  kids: <Baby className="h-6 w-6" />,
  books: <BookOpen className="h-6 w-6" />,
};

const colorMap: Record<string, string> = {
  electronics: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  fashion: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  home: "bg-green-100 text-green-700 hover:bg-green-200",
  sports: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  beauty: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  automotive: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  kids: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  books: "bg-teal-100 text-teal-700 hover:bg-teal-200",
};

export function CategoryGrid() {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold">Shop by Category</h2>
        <Link
          href="/products"
          className="text-sm text-primary font-medium hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="group"
          >
            <div
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all",
                colorMap[category.id]
              )}
            >
              {iconMap[category.id]}
            </div>
            <p className="text-xs font-medium text-center mt-2 group-hover:text-primary transition-colors">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
