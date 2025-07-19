import { MapPin, Pen, Handshake } from "lucide-react";

const DifferentiationSection = () => {
  return (
    <section className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          Why Quality Neighbor is Different
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <MapPin className="w-full h-16" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Hyper-Local Focus
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Every feature is designed specifically for neighborhood-level connections. 
              No generic content—just what matters to your local community.
            </p>
          </div>
          
          {/* Column 2 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Pen className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Quality Over Quantity
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              We prioritize meaningful connections and valuable content over viral posts 
              and endless scrolling. Every interaction has purpose.
            </p>
          </div>
          
          {/* Column 3 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-accent">
              <Handshake className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-poppins font-semibold text-2xl text-primary mb-4">
              Community-First Values
            </h3>
            <p className="font-inter text-foreground leading-relaxed">
              Built on principles of mutual support, respect, and positive engagement. 
              We foster connections that strengthen communities offline too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiationSection;