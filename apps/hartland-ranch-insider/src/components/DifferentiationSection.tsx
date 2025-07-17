import { MapPin, Pen, Handshake } from "lucide-react";

const DifferentiationSection = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          More Than Just a Newsletter: A Community Commitment
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <MapPin className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Hyper-Local Focus
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              We are 100% focused on Hartland Ranch. Every story, every recommendation, 
              every event is specifically relevant to your daily life here.
            </p>
          </div>
          
          {/* Column 2 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Pen className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Professionally Curated
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              No user-generated rants or arguments. Every piece of content is carefully 
              researched, fact-checked, and written by our local editorial team.
            </p>
          </div>
          
          {/* Column 3 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Handshake className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Community-First
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Our mission is to strengthen the community fabric by highlighting what brings 
              us together, not what divides us. Positivity is our editorial policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;