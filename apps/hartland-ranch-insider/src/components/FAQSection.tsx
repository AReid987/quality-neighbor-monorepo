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
      question: "Is this really free? What's the catch?",
      answer: "Yes, it's 100% free for residents, always. The newsletter is supported by our local business sponsors who, like you, want to build a stronger community. There is no catch."
    },
    {
      question: "Will you sell my data or spam my inbox?",
      answer: "Absolutely not. Your trust is our most important asset. We will never sell your email address. You will receive exactly one email newsletter per month from us, plus occasional critical community alerts (e.g., major road closures). That's our promise."
    },
    {
      question: "How do you choose what to include?",
      answer: "Our editorial team focuses on three criteria: Is it relevant to Hartland Ranch residents? Is it positive or constructive? Will it help neighbors connect or improve their daily lives? Everything else gets filtered out."
    },
    {
      question: "Can I suggest content or events to feature?",
      answer: "Absolutely! We love hearing from neighbors. Email us at tips@qualityneighbor.com with local business recommendations, community events, or positive neighbor stories you think we should know about."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          Have Questions? We've Got Answers.
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