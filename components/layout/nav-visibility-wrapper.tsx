"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FooterMobile } from "@/components/footer-mobile";

export function NavVisibilityWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide the store's navbar and footer on vendor pages
  const isVendorPage = pathname?.startsWith("/vendor");

  if (isVendorPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FooterMobile />
    </>
  );
}
