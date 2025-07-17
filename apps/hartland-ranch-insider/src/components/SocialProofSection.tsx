import davidChen from "@/assets/david-chen.jpg";

const SocialProofSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          Trusted by Your Hartland Ranch Neighbors
        </h2>
        
        {/* Featured Testimonial */}
        <div className="border border-border rounded-lg p-8 mb-12 bg-card">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <img 
              src={davidChen} 
              alt="David Chen" 
              className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            />
            <div className="text-center md:text-left">
              <blockquote className="font-inter italic text-xl text-foreground leading-relaxed mb-4">
                "I finally feel like I know what's going on in my own neighborhood. I've discovered 
                two new favorite restaurants and a great handyman, all from the newsletter. It's the 
                one email I actually look forward to."
              </blockquote>
              <cite className="font-inter font-bold text-foreground">
                – David Chen, Hartland Ranch Resident
              </cite>
            </div>
          </div>
        </div>
        
        {/* Security Assurance */}
        <p className="font-inter text-sm text-center text-muted-foreground">
          Your trust is our #1 priority. We will never sell your email or spam you. That's our promise.
        </p>
        
        {/* Local Business Logos */}
        <div className="mt-12">
          <div className="flex flex-wrap justify-center items-center space-x-8 opacity-60">
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              Hartland Market
            </div>
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              Ranch Coffee Co.
            </div>
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              Miller Hardware
            </div>
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              Greenway Fitness
            </div>
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              Bella Vista Dental
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;