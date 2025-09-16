"use client";

import { Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

const FinalCTASection = () => {
  const { user, qnUser } = useAuth();

  if (user && qnUser) {
    return (
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-bold text-4xl lg:text-5xl text-white mb-12">
            You're All Set!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Welcome to Quality Neighbor, {qnUser.first_name}!
          </p>
          <button 
            onClick={() => window.location.href = "/dashboard"}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-colors duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-blue-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-bold text-4xl lg:text-5xl text-white mb-12">
          Get the Next Issue.
        </h2>
        
        {/* Benefit Summary */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <span className="text-white text-lg">5-minute read, once a month.</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <span className="text-white text-lg">100% Community, 0% drama.</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Check className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <span className="text-white text-lg">The best local finds, free.</span>
          </div>
        </div>
        
        {/* Newsletter Signup (swapped to dedicated component) */}
        <div className="max-w-md mx-auto">
          <NewsletterSignup />
        </div>
        
        {/* Microcopy */}
        <p className="text-sm text-white opacity-80 mt-4">
          100% free. Unsubscribe anytime with one click.
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;