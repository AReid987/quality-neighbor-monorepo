"use client";

import { Check, Clock, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const HeroSection = () => {
  const { user, qnUser } = useAuth();

  // If user is already logged in, show different content
  if (user && qnUser) {
    return (
      <section className="relative min-h-screen flex items-center justify-center py-24">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/hero-background.jpg')` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-bold text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Welcome back, {qnUser.first_name}!
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              You're all set up for the Quality Neighbor newsletter and platform access.
            </p>
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-colors duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/hero-background.jpg')` 
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="font-bold text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Quality Neighbor.
            <br />
            <span className="text-white/90">(Without the Noise).</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Get a free, monthly newsletter that's actually about your community - not arguments. 
            Discover local gems, events, and news you'll actually use.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <span className="text-white text-lg">100% Community, 0% Drama.</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <span className="text-white text-lg">The best local news in a 5-minute read.</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <span className="text-white text-lg">Discover hidden gems and support local.</span>
            </div>
          </div>
          
          {/* Newsletter Signup (swapped to dedicated component) */}
          <div className="max-w-xl">
            <NewsletterSignup />
          </div>
          
          <p className="text-sm text-white/80 mt-4">
            Join thousands of neighbors building better communities!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;