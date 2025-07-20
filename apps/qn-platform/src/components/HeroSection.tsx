'use client'

import { Check, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, qnUser, loading } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="font-bold text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Connect with Your
            <br />
            <span className="text-yellow-400">Quality Neighbors</span>
          </h1>
          
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join a community platform that brings neighbors together, supports local businesses, 
            and creates meaningful connections in your neighborhood.
          </p>
          
          {/* Benefit Bullets */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <span className="text-white text-lg">Connect with verified neighbors</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <span className="text-white text-lg">Discover local events and news</span>
            </div>
            <div className="flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <span className="text-white text-lg">Support local businesses</span>
            </div>
          </div>
          
          {/* CTA Button */}
          {user && qnUser ? (
            <div className="space-y-4">
              <p className="text-white text-lg">
                Welcome back, {qnUser.first_name}!
              </p>
              <Button 
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-lg shadow-lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-lg shadow-lg"
              onClick={() => setAuthModalOpen(true)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Join Your Community"}
            </Button>
          )}
          
          {/* Trust Signal */}
          <p className="text-sm text-white/80 mt-4">
            Join thousands of neighbors building stronger communities!
          </p>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultMode="signup"
      />
    </section>
  );
};

export default HeroSection;