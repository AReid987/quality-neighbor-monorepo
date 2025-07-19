"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "Is Quality Neighbor free to use?",
      answer: "Yes, Quality Neighbor is completely free for community members. We're supported by local business partnerships and optional premium features that help enhance the community experience."
    },
    {
      question: "How do you verify community members?",
      answer: "We use a combination of address verification, phone number confirmation, and community vouching to ensure all members are genuine neighbors. This helps maintain a safe and trustworthy environment."
    },
    {
      question: "What makes this different from other social platforms?",
      answer: "Quality Neighbor is built specifically for local communities. We focus on positive, constructive interactions that strengthen neighborhood bonds rather than viral content or endless scrolling."
    },
    {
      question: "How do I get my business featured?",
      answer: "Local businesses can join our business directory and participate in community events. Contact us at business@qualityneighbor.com to learn about partnership opportunities and how to connect with your local customers."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left bg-card hover:bg-muted transition-colors duration-200 flex items-center justify-between"
              >
                <span className="font-inter font-semibold text-lg text-primary pr-4">
                  {item.question}
                </span>
                {openItems.includes(index) ? (
                  <Minus className="w-5 h-5 text-accent flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-accent flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 py-4 bg-card border-t border-border">
                  <p className="font-inter text-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;