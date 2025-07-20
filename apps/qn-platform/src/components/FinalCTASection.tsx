import { Check } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const FinalCTASection = () => {
  return (
    <section className="py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary-foreground mb-12">
          Ready to Connect with Your Community?
        </h2>
        
        {/* Benefit Summary */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="font-inter text-primary-foreground text-lg">Connect with verified neighbors</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="font-inter text-primary-foreground text-lg">Discover local businesses and events</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="font-inter text-primary-foreground text-lg">Build stronger community connections</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="max-w-md mx-auto">
          <NewsletterSignup className="bg-white/10 backdrop-blur-sm border-white/20" />
        </div>
        
        {/* Microcopy */}
        <p className="font-inter text-sm text-primary-foreground opacity-80">
          100% free to join. Start connecting with your neighbors today.
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;