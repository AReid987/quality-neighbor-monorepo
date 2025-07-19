import { Search, Users, Store } from "lucide-react";

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          Everything You Need for Community Connection
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Search className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Discover Local Gems
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Find the best local businesses, services, and hidden gems in your neighborhood 
              through trusted neighbor recommendations.
            </p>
          </div>
          
          {/* Column 2 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Users className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Build Real Connections
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Connect with verified neighbors, join local groups, and participate in 
              community events that bring people together.
            </p>
          </div>
          
          {/* Column 3 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Store className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Support Local Economy
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Discover and support local businesses while getting exclusive offers 
              and deals from your neighborhood merchants.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;