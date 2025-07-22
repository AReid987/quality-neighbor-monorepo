'use client';

import { useState } from "react";
import { Check, Clock, Sparkles, Search, Users, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { LoginModal } from "./LoginModal";

const LandingPage = () => {
  const { login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleGetStarted = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-24">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="font-bold text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Quality Neighbor.
              <br />
              <span className="text-white/90">(Without the Noise).</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Get a free, monthly newsletter that's actually about your community—not arguments. 
              Discover local gems, events, and news you'll actually use.
            </p>
            
            {/* Benefit Bullets */}
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
            
            {/* CTA Button */}
            <Button 
              onClick={handleGetStarted}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors duration-300 mb-4"
            >
              Get Started Free
            </Button>
            
            {/* Trust Signal */}
            <p className="text-sm text-white/80">
              Join thousands of neighbors building better communities!
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-4xl lg:text-5xl text-gray-800 mb-8">
            Tired of the Digital Drama?
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            You're looking for a good local plumber, not another political rant. You want to know about 
            the weekend farmers market, but all you see are complaints. The endless negativity is exhausting. 
            It makes you feel less connected to your neighbors, not more. You miss out on the best parts of 
            your community because they're buried in noise.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-bold text-4xl lg:text-5xl text-gray-800 text-center mb-16">
            Your Monthly Dose of Positive & Practical.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Column 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 text-blue-600">
                <Search className="w-full h-full" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-2xl text-gray-800 mb-4">
                Discover Local Secrets
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We find the best stuff so you don't have to. From the new bakery to the 
                highest-rated handyman, it's all here.
              </p>
            </div>
            
            {/* Column 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 text-blue-600">
                <Users className="w-full h-full" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-2xl text-gray-800 mb-4">
                Actually Feel Connected
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Learn about local events, volunteer opportunities, and neighborly needs that 
                build a real community, offline.
              </p>
            </div>
            
            {/* Column 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 text-blue-600">
                <Store className="w-full h-full" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-2xl text-gray-800 mb-4">
                Support Local & Save
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get exclusive offers from local businesses that make our 
                neighborhood great.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-4xl lg:text-5xl text-white mb-8">
            Ready to Rediscover Your Community?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join the Quality Neighbor platform and start building better connections with your neighbors today.
          </p>
          
          <Button 
            onClick={handleGetStarted}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors duration-300"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 Quality Neighbor. Building better communities, one neighbor at a time.
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default LandingPage;