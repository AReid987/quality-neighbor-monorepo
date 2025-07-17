import { Check } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-24 bg-primary">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary-foreground mb-12">
          Get the Next Issue.
        </h2>
        
        {/* Benefit Summary */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="font-inter text-primary-foreground text-lg">5-minute read, once a month.</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="font-inter text-primary-foreground text-lg">100% Hartland Ranch, 0% drama.</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-accent flex-shrink-0" />
            <span className="font-inter text-primary-foreground text-lg">The best local finds, free.</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <button className="bg-accent hover:bg-accent-hover text-accent-foreground font-inter font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 mb-4">
          Get the Free Newsletter
        </button>
        
        {/* Microcopy */}
        <p className="font-inter text-sm text-primary-foreground opacity-80">
          100% free. Unsubscribe anytime with one click.
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;