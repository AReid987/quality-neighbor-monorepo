const SocialProofSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-poppins font-semibold text-4xl lg:text-5xl text-primary text-center mb-16">
          Trusted by Neighbors Everywhere
        </h2>
        
        {/* Featured Testimonial */}
        <div className="border border-border rounded-lg p-8 mb-12 bg-card">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-accent">SC</span>
            </div>
            <div className="text-center md:text-left">
              <blockquote className="font-inter italic text-xl text-foreground leading-relaxed mb-4">
                "Quality Neighbor has transformed how I connect with my community. I've found amazing 
                local services, made new friends, and feel more connected to my neighborhood than ever before."
              </blockquote>
              <cite className="font-inter font-bold text-foreground">
                — Sarah Chen, Community Member
              </cite>
            </div>
          </div>
        </div>
        
        {/* Security Assurance */}
        <p className="font-inter text-sm text-center text-muted-foreground">
          Your privacy and safety are our top priorities. All members are verified and our platform 
          is designed with community guidelines that promote positive interactions.
        </p>
        
        {/* Community Stats */}
        <div className="mt-12">
          <div className="flex flex-wrap justify-center items-center space-x-8 opacity-60">
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              10,000+ Active Members
            </div>
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              500+ Local Businesses
            </div>
            <div className="font-inter font-semibold text-muted-foreground text-sm py-2">
              50+ Neighborhoods
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;