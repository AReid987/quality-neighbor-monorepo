"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const FinalCTASection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, user, qnUser } = useAuth();

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email address to sign up for the newsletter.");
      return;
    }

    setLoading(true);
    try {
      // Generate a temporary password for newsletter signup
      const tempPassword = Math.random().toString(36).slice(-8) + "!1A";
      
      const { error } = await signUp(email, tempPassword, {
        firstName: "Newsletter",
        lastName: "Subscriber", 
        location: "Community",
        role: "Resident"
      });

      if (error) {
        alert(`Signup failed: ${error.message || error}`);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

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
        
        {/* Newsletter Signup Form */}
        <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black font-bold text-lg px-8 py-3 rounded-lg shadow-lg transition-colors duration-300"
          >
            {loading ? "Signing Up..." : "Get the Free Newsletter"}
          </button>
        </form>
        
        {/* Microcopy */}
        <p className="text-sm text-white opacity-80">
          100% free. Unsubscribe anytime with one click.
        </p>
      </div>
    </section>
  );
};

export default FinalCTASection;