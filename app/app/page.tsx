
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { MobileSection } from '@/components/mobile-section'
import { AIAutoStackSection } from '@/components/ai-autostack-section'
import { AppEcosystemDashboard } from '@/components/app-ecosystem-dashboard'
import { PartnershipSection } from '@/components/partnership-section'
import { PricingSection } from '@/components/pricing-section'
import { ContactSection } from '@/components/contact-section'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <MobileSection />
      <AIAutoStackSection />
      <AppEcosystemDashboard />
      <PartnershipSection />
      <PricingSection />
      <ContactSection />
      <Footer />
      <Toaster position="top-right" theme="dark" />
    </main>
  )
}
