import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { FooterMobile } from '@/components/footer-mobile';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FooterMobile />
    </div>
  )
}
