import { MapPin, Pen, Handshake } from "lucide-react";

const DifferentiationSection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-bold text-4xl lg:text-5xl text-gray-800 text-center mb-16">
          More Than Just a Newsletter: A Community Commitment
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-blue-600">
              <MapPin className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-2xl text-gray-800 mb-4">
              Hyper-Local Focus
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We are 100% focused on your community. Every story, every recommendation, 
              every event is specifically relevant to your daily life here.
            </p>
          </div>
          
          {/* Column 2 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-blue-600">
              <Pen className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-2xl text-gray-800 mb-4">
              Professionally Curated
            </h3>
            <p className="text-gray-600 leading-relaxed">
              No user-generated rants or arguments. Every piece of content is carefully 
              researched, fact-checked, and written by our local editorial team.
            </p>
          </div>
          
          {/* Column 3 */}
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 text-blue-600">
              <Handshake className="w-full h-full" strokeWidth={1.5} />
            </div>
            <h3 className="font-bold text-2xl text-gray-800 mb-4">
              Community-First
            </h3>
            <p className="text-gray-600 leading-relaxed">
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