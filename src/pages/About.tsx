import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-4">
              About Auction Grid
            </h1>
            <div className="h-0.5 w-48 bg-accent mx-auto" />
          </div>

          <div className="space-y-8 font-sans">
            <section>
              <h2 className="font-grotesk font-semibold text-2xl mb-4 text-primary">Our Mission</h2>
              <p className="text-foreground/80 leading-relaxed">
                Auction Grid is a government initiative developed by Hawk Infosys Pvt. Ltd. to bring transparency, 
                fairness, and accessibility to the auction process across Gujarat. We believe that every citizen 
                deserves equal opportunity to participate in government-approved auctions.
              </p>
            </section>

            <section>
              <h2 className="font-grotesk font-semibold text-2xl mb-4 text-primary">What We Offer</h2>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  100% Government-verified auction listings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  Transparent bidding process with clear fee structures
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  Secure payment and verification systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">✓</span>
                  Wide range of categories: Vehicles, Property, and Antiques
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-grotesk font-semibold text-2xl mb-4 text-primary">Why Choose Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                Our platform combines modern technology with government accountability to create 
                a seamless auction experience. Every listing is verified, every transaction is secure, 
                and every participant is treated fairly.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
