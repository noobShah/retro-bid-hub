import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuctionCard } from "@/components/AuctionCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import auctionCar from "@/assets/auction-car-1.jpg";
import auctionBike from "@/assets/auction-bike-1.jpg";
import auctionProperty from "@/assets/auction-property-1.jpg";
const Home = () => {
  // Mock data - would come from database
  const popularAuctions = [{
    id: "1",
    title: "Maruti Swift VXI 2018",
    image: auctionCar,
    basePrice: 120000,
    bidders: 23,
    timeRemaining: "2d 14h",
    category: "Four Wheeler"
  }, {
    id: "2",
    title: "Royal Enfield Classic 350",
    image: auctionBike,
    basePrice: 85000,
    bidders: 18,
    timeRemaining: "1d 8h",
    category: "Two Wheeler"
  }, {
    id: "3",
    title: "2BHK Apartment Ahmedabad",
    image: auctionProperty,
    basePrice: 2500000,
    bidders: 31,
    timeRemaining: "3d 2h",
    category: "Property"
  }];
  const expiringSoon = [{
    id: "4",
    title: "Honda City 2019",
    image: auctionCar,
    basePrice: 450000,
    bidders: 15,
    timeRemaining: "6h 23m",
    category: "Four Wheeler"
  }, {
    id: "5",
    title: "Bajaj Pulsar NS200",
    image: auctionBike,
    basePrice: 65000,
    bidders: 12,
    timeRemaining: "12h 45m",
    category: "Two Wheeler"
  }, {
    id: "6",
    title: "Commercial Shop Surat",
    image: auctionProperty,
    basePrice: 1800000,
    bidders: 9,
    timeRemaining: "18h 15m",
    category: "Property"
  }];
  return <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-secondary py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="border-4 border-accent/20 p-8 md:p-12 relative mb-8">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-gold -mt-2 -ml-2" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-gold -mt-2 -mr-2" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-gold -mb-2 -ml-2" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-gold -mb-2 -mr-2" />
            
            <h1 className="font-courier font-bold text-4xl md:text-5xl uppercase tracking-wider mb-4 text-foreground">
              Welcome to Auction Grid
            </h1>
            <p className="font-grotesk text-xl md:text-2xl text-accent">
              Fair. Fast. Transparent.
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-sans text-lg text-foreground/80">
              Government-Approved Auctions Across Gujarat
            </p>
            <Button variant="hero" asChild>
              <Link to="/auctions">Explore All Auctions →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-courier font-bold text-3xl uppercase tracking-wider mb-2">
              How Government Auctions Work
            </h2>
            <div className="h-0.5 w-48 bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center p-6 bg-card border-2 border-border rounded-md">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="font-grotesk font-semibold text-xl mb-3 text-primary">Browse</h3>
              <p className="font-sans text-sm text-foreground/70">
                Explore verified listings of vehicles, property, and antiques
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 bg-card border-2 border-border rounded-md">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="font-grotesk font-semibold text-xl mb-3 text-primary">Bid</h3>
              <p className="font-sans text-sm text-foreground/70">
                Place your bid with transparent pricing and secure payments
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 bg-card border-2 border-border rounded-md">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="font-grotesk font-semibold text-xl mb-3 text-primary">Win</h3>
              <p className="font-sans text-sm text-foreground/70">
                Secure your asset through fair and transparent process
              </p>
            </div>
          </div>

          <div className="mt-12 max-w-2xl mx-auto space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <p className="font-sans text-sm text-foreground/80">100% Government-Verified Listings</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <p className="font-sans text-sm text-foreground/80">Transparent Bidding Process</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success mt-1">✓</span>
              <p className="font-sans text-sm text-foreground/80">Secure Payment Schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Most Popular Auctions */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="font-courier font-bold text-3xl uppercase tracking-wider mb-2">
              Most Popular Auctions
            </h2>
            <p className="font-sans text-sm text-foreground/70">
              Sorted by participation (highest bidders first)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularAuctions.map(auction => <AuctionCard key={auction.id} {...auction} />)}
          </div>
        </div>
      </section>

      {/* Expiring Soon */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="font-courier font-bold text-3xl uppercase tracking-wider mb-2 text-destructive">Expiring Soon</h2>
            <p className="font-sans text-sm text-foreground/70">
              Act fast! These auctions are ending soon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiringSoon.map(auction => <AuctionCard key={auction.id} {...auction} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Home;