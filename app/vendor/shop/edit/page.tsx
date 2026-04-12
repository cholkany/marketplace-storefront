"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { medusaClient } from "@/lib/medusa";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Store,
  CheckCircle2,
  ArrowLeft,
  ImageIcon,
  Instagram,
  Twitter,
  Facebook,
  Globe,
  FileText,
  Phone,
  Mail,
  MapPin,
  Save,
  AlertCircle,
  ExternalLink,
  Loader2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "details", label: "Shop Details", icon: Store },
  { id: "branding", label: "Branding", icon: ImageIcon },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "policies", label: "Policies", icon: FileText },
];

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

interface ShopData {
  id: string;
  name: string;
  handle: string;
  logo?: string;
  description?: string;
  category?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  return_policy?: string;
  shipping_policy?: string;
  privacy_policy?: string;
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditShopPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [vendor, setVendor] = useState<ShopData | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Local form state — mirrors vendor fields
  const [form, setForm] = useState({
    name: "",
    handle: "",
    logo: "",
    description: "",
    category: "",
    instagram: "",
    twitter: "",
    facebook: "",
    website: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    city: "",
    country: "",
    return_policy: "",
    shipping_policy: "",
    privacy_policy: "",
  });

  const updateForm = useCallback((key: keyof typeof form, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name") next.handle = generateSlug(value);
      return next;
    });
    setSuccess(false);
  }, []);

  // Load vendor data on mount
  useEffect(() => {
    medusaClient.client
      .fetch("/vendors/me", { method: "GET" })
      .then((res: any) => {
        const v: ShopData | null = res?.vendor ?? null;
        if (!v) {
          // No shop yet — send to creation wizard
          router.replace("/vendor/create-shop");
          return;
        }
        setVendor(v);
        setForm({
          name: v.name ?? "",
          handle: v.handle ?? "",
          logo: v.logo ?? "",
          description: v.description ?? "",
          category: v.category ?? "",
          instagram: v.instagram ?? "",
          twitter: v.twitter ?? "",
          facebook: v.facebook ?? "",
          website: v.website ?? "",
          contact_email: v.contact_email ?? "",
          contact_phone: v.contact_phone ?? "",
          address: v.address ?? "",
          city: v.city ?? "",
          country: v.country ?? "",
          return_policy: v.return_policy ?? "",
          shipping_policy: v.shipping_policy ?? "",
          privacy_policy: v.privacy_policy ?? "",
        });
      })
      .catch((err: any) => {
        const status = err?.status ?? err?.response?.status;
        if (status === 401 || status === 403) {
          router.replace("/vendor/login");
        } else {
          setVendor(null);
          setIsLoading(false);
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await medusaClient.client.fetch("/vendors/me", {
        method: "PATCH",
        body: {
          name: form.name || undefined,
          handle: form.handle || undefined,
          logo: form.logo || undefined,
          description: form.description || undefined,
          category: form.category || undefined,
          instagram: form.instagram || undefined,
          twitter: form.twitter || undefined,
          facebook: form.facebook || undefined,
          website: form.website || undefined,
          contact_email: form.contact_email || undefined,
          contact_phone: form.contact_phone || undefined,
          address: form.address || undefined,
          city: form.city || undefined,
          country: form.country || undefined,
          return_policy: form.return_policy || undefined,
          shipping_policy: form.shipping_policy || undefined,
          privacy_policy: form.privacy_policy || undefined,
        },
      });
      setSuccess(true);
      // scroll to top so success banner is visible
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2 text-muted-foreground">
                <Link href="/vendor/dashboard">
                  <ArrowLeft className="h-4 w-4" /> Dashboard
                </Link>
              </Button>
            </div>
            <h1 className="text-2xl font-bold font-serif">Edit Your Shop</h1>
            {vendor && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Public URL:{" "}
                <a
                  href={`/shop/${vendor.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  /shop/{vendor.handle}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            )}
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="gap-2 min-w-[120px]">
            {isSaving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="h-4 w-4" /> Save Changes</>
            )}
          </Button>
        </div>

        {/* Status Alerts */}
        {success && (
          <div className="mb-6 flex items-start gap-3 bg-green-500/10 text-green-700 dark:text-green-400 text-sm p-4 rounded-xl border border-green-500/20">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            Shop updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <nav className="md:w-52 shrink-0">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border last:border-0",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content Panel */}
          <div className="flex-1 bg-card border border-border rounded-xl p-6 space-y-6">

            {/* ── SHOP DETAILS ── */}
            {activeTab === "details" && (
              <>
                <div>
                  <h2 className="text-lg font-bold font-serif mb-1">Shop Details</h2>
                  <p className="text-sm text-muted-foreground">Basic information about your shop.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Shop Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="e.g. Artisan Collective"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="handle">Shop URL</Label>
                    <div className="flex items-center">
                      <span className="bg-muted border border-r-0 border-border rounded-l-md px-3 py-2 text-sm text-muted-foreground h-10 flex items-center shrink-0">
                        /shop/
                      </span>
                      <Input
                        id="handle"
                        value={form.handle}
                        onChange={(e) => updateForm("handle", generateSlug(e.target.value))}
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Changing this URL will break existing links to your shop.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={form.category}
                      onChange={(e) => updateForm("category", e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Shop Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      placeholder="Tell customers what makes your shop unique..."
                      value={form.description}
                      onChange={(e) => updateForm("description", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{form.description.length}/500 characters</p>
                  </div>
                </div>
              </>
            )}

            {/* ── BRANDING ── */}
            {activeTab === "branding" && (
              <>
                <div>
                  <h2 className="text-lg font-bold font-serif mb-1">Branding</h2>
                  <p className="text-sm text-muted-foreground">Logo, banner, and social links.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl border-2 border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {form.logo ? (
                          <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Store className="h-7 w-7 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="https://example.com/logo.png"
                          value={form.logo}
                          onChange={(e) => updateForm("logo", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Paste a public image URL. Recommended: 400×400px square.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <h3 className="font-medium text-sm mb-3">Social Media</h3>
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
                            value={form[key as keyof typeof form]}
                            onChange={(e) => updateForm(key as keyof typeof form, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── CONTACT ── */}
            {activeTab === "contact" && (
              <>
                <div>
                  <h2 className="text-lg font-bold font-serif mb-1">Contact Information</h2>
                  <p className="text-sm text-muted-foreground">Shown publicly on your shop page.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Contact Email
                    </Label>
                    <Input
                      id="contact_email"
                      type="email"
                      placeholder="contact@yourshop.com"
                      value={form.contact_email}
                      onChange={(e) => updateForm("contact_email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone Number
                    </Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.contact_phone}
                      onChange={(e) => updateForm("contact_phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Address
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
              </>
            )}

            {/* ── POLICIES ── */}
            {activeTab === "policies" && (
              <>
                <div>
                  <h2 className="text-lg font-bold font-serif mb-1">Shop Policies</h2>
                  <p className="text-sm text-muted-foreground">Set clear expectations with your customers.</p>
                </div>

                <div className="space-y-5">
                  {[
                    { key: "return_policy", label: "Return Policy" },
                    { key: "shipping_policy", label: "Shipping Policy" },
                    { key: "privacy_policy", label: "Privacy Policy" },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>{label}</Label>
                      <Textarea
                        id={key}
                        rows={4}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateForm(key as keyof typeof form, e.target.value)}
                        className="resize-none"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Footer Save Button */}
            <div className="pt-4 border-t border-border flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Changes</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
