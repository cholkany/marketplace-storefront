"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { medusaClient } from "@/lib/medusa";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Store,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ImageIcon,
  Instagram,
  Twitter,
  Facebook,
  Globe,
  FileText,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Upload,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Shop Details", icon: Store },
  { id: 2, label: "Branding", icon: ImageIcon },
  { id: 3, label: "Contact", icon: Phone },
  { id: 4, label: "Policies", icon: FileText },
];

interface ShopFormData {
  // Step 1 – Shop Details
  shopName: string;
  slug: string;
  description: string;
  category: string;
  // Step 2 – Branding
  logo: File | null;
  logoPreview: string;
  banner: File | null;
  bannerPreview: string;
  instagram: string;
  twitter: string;
  facebook: string;
  website: string;
  // Step 3 – Contact & Admin
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  // Step 4 – Policies
  returnPolicy: string;
  shippingPolicy: string;
  privacyPolicy: string;
}

const CATEGORIES = [
  "Electronics",
  "Fashion & Apparel",
  "Home & Garden",
  "Sports & Outdoors",
  "Beauty & Health",
  "Automotive",
  "Books & Media",
  "Kids & Baby",
  "Art & Crafts",
  "Food & Beverages",
  "Jewelry & Accessories",
  "Other",
];

const DEFAULT_POLICIES = {
  returnPolicy:
    "We accept returns within 30 days of purchase. Items must be in their original condition and packaging. Please contact us to initiate a return.",
  shippingPolicy:
    "We process orders within 1-2 business days. Standard shipping takes 5-7 business days. Express shipping is available at checkout.",
  privacyPolicy:
    "We respect your privacy and are committed to protecting your personal data. We do not share your information with third parties without your consent.",
};

export default function CreateShopPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Redirect authenticated vendors who already have a shop to the edit page
  useEffect(() => {
    medusaClient.client
      .fetch("/vendors/me", { method: "GET" })
      .then((res: any) => {
        if (res?.vendor?.id) {
          router.replace("/vendor/shop/edit");
        } else {
          setCheckingExisting(false);
        }
      })
      .catch(() => {
        // Not authenticated or no vendor — allow shop creation
        setCheckingExisting(false);
      });
  }, [router]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ShopFormData>({
    shopName: "",
    slug: "",
    description: "",
    category: "",
    logo: null,
    logoPreview: "",
    banner: null,
    bannerPreview: "",
    instagram: "",
    twitter: "",
    facebook: "",
    website: "",
    firstName: "",
    lastName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    city: "",
    country: "",
    returnPolicy: DEFAULT_POLICIES.returnPolicy,
    shippingPolicy: DEFAULT_POLICIES.shippingPolicy,
    privacyPolicy: DEFAULT_POLICIES.privacyPolicy,
  });

  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");

  const updateForm = useCallback(
    (key: keyof ShopFormData, value: string | File | null) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        if (key === "shopName" && typeof value === "string") {
          next.slug = generateSlug(value);
        }
        return next;
      });
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const handleImageUpload = (
    field: "logo" | "banner",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewKey = field === "logo" ? "logoPreview" : "bannerPreview";
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [field]: file, [previewKey]: url }));
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!form.shopName.trim()) errors.shopName = "Shop name is required";
      if (!form.slug.trim()) errors.slug = "URL slug is required";
      if (!form.description.trim()) errors.description = "Description is required";
      if (!form.category) errors.category = "Please select a category";
    }
    if (step === 3) {
      if (!form.firstName.trim()) errors.firstName = "First name is required";
      if (!form.contactEmail.trim()) errors.contactEmail = "Business email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
        errors.contactEmail = "Enter a valid email";
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      // Backend now accepts all profile fields as top-level keys
      await medusaClient.client.fetch("/vendors", {
        method: "POST",
        body: {
          name: form.shopName,
          handle: form.slug || undefined,
          // Profile fields stored directly on the vendor record
          description: form.description || undefined,
          category: form.category || undefined,
          instagram: form.instagram || undefined,
          twitter: form.twitter || undefined,
          facebook: form.facebook || undefined,
          website: form.website || undefined,
          contact_email: form.contactEmail || undefined,
          contact_phone: form.contactPhone || undefined,
          address: form.address || undefined,
          city: form.city || undefined,
          country: form.country || undefined,
          return_policy: form.returnPolicy || undefined,
          shipping_policy: form.shippingPolicy || undefined,
          privacy_policy: form.privacyPolicy || undefined,
          admin: {
            email: form.contactEmail,
            first_name: form.firstName || undefined,
            last_name: form.lastName || undefined,
          },
        },
      });

      router.push("/vendor");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create shop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  if (checkingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Checking your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-serif">Create Your Shop</h1>
        <p className="text-muted-foreground mt-2">
          Step {step} of {STEPS.length} — {STEPS[step - 1].label}
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div
                key={s.id}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-background border-primary text-primary shadow-sm shadow-primary/25"
                        : "bg-background border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isCurrent ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* ── STEP 1: Shop Details ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif mb-1">Shop Details</h2>
              <p className="text-sm text-muted-foreground">
                Tell customers what your shop is about.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name *</Label>
              <Input
                id="shopName"
                placeholder="e.g. Artisan Collective"
                value={form.shopName}
                onChange={(e) => updateForm("shopName", e.target.value)}
                className={stepErrors.shopName ? "border-destructive" : ""}
              />
              {stepErrors.shopName && (
                <p className="text-xs text-destructive">{stepErrors.shopName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Shop URL</Label>
              <div className="flex items-center gap-0">
                <span className="bg-muted border border-r-0 border-border rounded-l-md px-3 py-2 text-sm text-muted-foreground h-10 flex items-center">
                  /shop/
                </span>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => updateForm("slug", generateSlug(e.target.value))}
                  className={cn(
                    "rounded-l-none",
                    stepErrors.slug ? "border-destructive" : ""
                  )}
                  placeholder="artisan-collective"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-generated from shop name. Customize if needed.
              </p>
              {stepErrors.slug && (
                <p className="text-xs text-destructive">{stepErrors.slug}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                className={cn(
                  "w-full h-10 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  stepErrors.category ? "border-destructive" : "border-input"
                )}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {stepErrors.category && (
                <p className="text-xs text-destructive">{stepErrors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Shop Description *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Tell customers what makes your shop unique..."
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                className={stepErrors.description ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                {form.description.length}/500 characters
              </p>
              {stepErrors.description && (
                <p className="text-xs text-destructive">{stepErrors.description}</p>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Branding ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif mb-1">Branding</h2>
              <p className="text-sm text-muted-foreground">
                Upload your shop logo and banner to make a great first impression.
              </p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-3">
              <Label>Shop Logo</Label>
              <div className="flex items-center gap-5">
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className={cn(
                    "w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary hover:bg-primary/5 shrink-0",
                    form.logoPreview ? "border-primary/30 p-0 overflow-hidden" : "border-border"
                  )}
                >
                  {form.logoPreview ? (
                    <img
                      src={form.logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Shop Logo</p>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 400×400px, PNG or JPG
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => logoInputRef.current?.click()}
                    className="mt-2"
                  >
                    Choose File
                  </Button>
                </div>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("logo", e)}
              />
            </div>

            {/* Banner Upload */}
            <div className="space-y-3">
              <Label>Shop Banner</Label>
              <div
                onClick={() => bannerInputRef.current?.click()}
                className={cn(
                  "w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-primary hover:bg-primary/5 relative overflow-hidden",
                  form.bannerPreview ? "border-primary/30 p-0" : "border-border"
                )}
              >
                {form.bannerPreview ? (
                  <>
                    <img
                      src={form.bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Change Banner</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-7 w-7 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Upload Banner Image</p>
                    <p className="text-xs text-muted-foreground">
                      Recommended: 1200×400px, PNG or JPG
                    </p>
                  </>
                )}
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload("banner", e)}
              />
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Social Media</h3>
                <p className="text-xs text-muted-foreground">
                  Connect your social accounts to build trust with customers.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "instagram", Icon: Instagram, placeholder: "@yourshop", label: "Instagram" },
                  { key: "twitter", Icon: Twitter, placeholder: "@yourshop", label: "Twitter / X" },
                  { key: "facebook", Icon: Facebook, placeholder: "facebook.com/yourshop", label: "Facebook" },
                  { key: "website", Icon: Globe, placeholder: "https://yourshop.com", label: "Website" },
                ].map(({ key, Icon, placeholder, label }) => (
                  <div key={key} className="space-y-1.5">
                    <Label htmlFor={key} className="flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </Label>
                    <Input
                      id={key}
                      placeholder={placeholder}
                      value={form[key as keyof ShopFormData] as string}
                      onChange={(e) => updateForm(key as keyof ShopFormData, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Contact Info ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif mb-1">Contact Information</h2>
              <p className="text-sm text-muted-foreground">
                Your name and business email are used to set up your vendor account.
              </p>
            </div>

            {/* Admin identity fields — sent to backend */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-4">
              <p className="text-xs font-medium text-primary uppercase tracking-wide">Account Details</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={(e) => updateForm("firstName", e.target.value)}
                    className={stepErrors.firstName ? "border-destructive" : ""}
                  />
                  {stepErrors.firstName && (
                    <p className="text-xs text-destructive">{stepErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={(e) => updateForm("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Business Email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="you@yourshop.com"
                  value={form.contactEmail}
                  onChange={(e) => updateForm("contactEmail", e.target.value)}
                  className={stepErrors.contactEmail ? "border-destructive" : ""}
                />
                {stepErrors.contactEmail && (
                  <p className="text-xs text-destructive">{stepErrors.contactEmail}</p>
                )}
                <p className="text-xs text-muted-foreground">This becomes your vendor admin login email.</p>
              </div>
            </div>

            {/* Optional contact info shown on shop page */}
            <div className="space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Public Contact Info (optional)</p>

              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.contactPhone}
                  onChange={(e) => updateForm("contactPhone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="Street Address"
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={form.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Policies ── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif mb-1">Shop Policies</h2>
              <p className="text-sm text-muted-foreground">
                Set clear expectations with your customers. We&apos;ve added sensible defaults — customize them to fit your shop.
              </p>
            </div>

            {[
              { key: "returnPolicy", label: "Return Policy", icon: FileText },
              { key: "shippingPolicy", label: "Shipping Policy", icon: FileText },
              { key: "privacyPolicy", label: "Privacy Policy", icon: FileText },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Textarea
                  id={key}
                  rows={4}
                  value={form[key as keyof ShopFormData] as string}
                  onChange={(e) => updateForm(key as keyof ShopFormData, e.target.value)}
                  className="resize-none"
                />
              </div>
            ))}

            {/* Summary preview */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h3 className="font-medium text-sm mb-2">Shop Summary</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Name:</span> {form.shopName || "—"}
                </div>
                <div>
                  <span className="font-medium text-foreground">URL:</span>{" "}
                  /shop/{form.slug || "—"}
                </div>
                <div>
                  <span className="font-medium text-foreground">Category:</span>{" "}
                  {form.category || "—"}
                </div>
                <div>
                  <span className="font-medium text-foreground">Contact:</span>{" "}
                  {form.contactEmail || "—"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Link href="/vendor/login">
              <Button variant="ghost" className="gap-2 text-muted-foreground">
                Already have a shop?
              </Button>
            </Link>
          )}

          {step < 4 ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                "Creating Shop..."
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Launch Shop
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
