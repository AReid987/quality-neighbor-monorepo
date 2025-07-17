import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import BenefitsSection from "@/components/BenefitsSection";
import SocialProofSection from "@/components/SocialProofSection";
import DifferentiationSection from "@/components/DifferentiationSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProblemSection />
      <BenefitsSection />
      <SocialProofSection />
      <DifferentiationSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
