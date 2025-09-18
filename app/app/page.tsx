
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { MobileSection } from '@/components/mobile-section'
import { PartnershipSection } from '@/components/partnership-section'
import { EcosystemSection } from '@/components/ecosystem-section'
import { PricingSection } from '@/components/pricing-section'
import { ContactSection } from '@/components/contact-section'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <MobileSection />
      <PartnershipSection />
      <EcosystemSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
