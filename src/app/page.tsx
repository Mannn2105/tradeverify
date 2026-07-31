import Header from "@/components/Header";
import TrustTicker from "@/components/TrustTicker";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import VerificationSection from "@/components/VerificationSection";
import SplitSection from "@/components/SplitSection";
import StatsBand from "@/components/StatsBand";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <TrustTicker />
        <Hero />
        <HowItWorks />
        <VerificationSection />
        <SplitSection />
        <StatsBand />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
