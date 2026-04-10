"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "Flash Sale Weekend",
    subtitle: "Up to 50% Off on Electronics",
    cta: "Shop Now",
    bgColor: "bg-primary",
    textColor: "text-primary-foreground",
  },
  {
    id: 2,
    title: "New Season Fashion",
    subtitle: "Discover the Latest Trends",
    cta: "Explore Collection",
    bgColor: "bg-foreground",
    textColor: "text-background",
  },
  {
    id: 3,
    title: "Home Essentials",
    subtitle: "Transform Your Space",
    cta: "Shop Home",
    bgColor: "bg-accent",
    textColor: "text-accent-foreground",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={cn(
              "min-w-full h-[280px] md:h-[380px] flex items-center justify-center px-8",
              slide.bgColor
            )}
          >
            <div className="text-center max-w-2xl">
              <h2
                className={cn(
                  "font-serif text-3xl md:text-5xl font-bold mb-4",
                  slide.textColor
                )}
              >
                {slide.title}
              </h2>
              <p
                className={cn(
                  "text-lg md:text-xl mb-6 opacity-90",
                  slide.textColor
                )}
              >
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                variant={slide.bgColor === "bg-primary" ? "secondary" : "default"}
                className="font-medium"
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index
                ? "bg-background w-6"
                : "bg-background/50 hover:bg-background/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
