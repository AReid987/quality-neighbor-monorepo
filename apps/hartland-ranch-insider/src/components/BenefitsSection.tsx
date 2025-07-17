import { Search, Users, Store } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          Your Monthly Dose of Positive & Practical.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Search className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Discover Local Secrets
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              We find the best stuff so you don't have to. From the new bakery to the 
              highest-rated handyman, it's all here.
            </p>
          </div>
          
          {/* Column 2 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Users className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Actually Feel Connected
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Learn about local events, volunteer opportunities, and neighborly needs that 
              build a real community, offline.
            </p>
          </div>
          
          {/* Column 3 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Store className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Support Local & Save
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Get exclusive offers from the Hartland Ranch businesses that make our 
              neighborhood great.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;