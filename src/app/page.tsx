import Header from "@/components/Header";
import TrustTicker from "@/components/TrustTicker";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import VerificationSection from "@/components/VerificationSection";
import SplitSection from "@/components/SplitSection";
import StatsBand from "@/components/StatsBand";
import FaqSection from "@/components/FaqSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <TrustTicker />
        <Hero />
        <HowItWorks />
        <VerificationSection />
        <SplitSection />
        <StatsBand />
        <FaqSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
