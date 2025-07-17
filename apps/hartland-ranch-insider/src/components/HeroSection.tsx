import { Check, Clock, Sparkles } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="font-poppins font-semibold text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Rediscover Hartland Ranch.
            <br />
            <span className="text-white/90">(Without the Noise).</span>
          </h1>
          
          <p className="font-inter text-xl text-white/90 mb-8 leading-relaxed">
            Get a free, monthly email that's actually about your community—not arguments. 
            Discover local gems, events, and news you'll actually use.
          </p>
          
          {/* Benefit Bullets */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6 text-accent flex-shrink-0" />
              <span className="font-inter text-white text-lg">100% Hartland Ranch, 0% Drama.</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-accent flex-shrink-0" />
              <span className="font-inter text-white text-lg">The best local news in a 5-minute read.</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-accent flex-shrink-0" />
              <span className="font-inter text-white text-lg">Discover hidden gems and support local.</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <button className="bg-accent hover:bg-accent-hover text-accent-foreground font-inter font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 mb-4">
            Get the Free Newsletter
          </button>
          
          {/* Trust Signal */}
          <p className="font-inter text-sm text-white/80">
            Join 500+ of your neighbors!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;