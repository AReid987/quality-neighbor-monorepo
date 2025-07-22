'use client';

import { Check, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bold text-5xl lg:text-7xl text-gray-900 mb-6 leading-tight">
            Quality Neighbor
            <br />
            <span className="text-blue-600">Newsletter Strategy</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Build authentic community connections through hyperlocal content that residents actually want to read.
            No drama, just genuine neighborhood value.
          </p>
          
          {/* Benefit Bullets */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <Check className="w-8 h-8 text-green-600 flex-shrink-0" />
              <span className="text-gray-800 text-lg font-medium text-center">100% Community Focus, 0% Drama</span>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <Clock className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <span className="text-gray-800 text-lg font-medium text-center">5-Minute Monthly Read</span>
            </div>
            <div className="flex flex-col items-center space-y-3 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
              <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0" />
              <span className="text-gray-800 text-lg font-medium text-center">Discover Local Gems</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Get Started with Strategy Guide
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {/* Trust Signal */}
          <p className="text-sm text-gray-600 mt-6">
            Join the movement to rebuild authentic neighborhood connections
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;