import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import auctionCar from "@/assets/auction-car-1.jpg";

const AuctionDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - would come from database
  const auction = {
    id: "1",
    title: "Maruti Swift VXI 2018",
    images: [auctionCar, auctionCar, auctionCar],
    basePrice: 120000,
    bidders: 23,
    timeRemaining: "2d 14h 32m",
    isCooldown: true,
    category: "Four Wheeler",
    description:
      "Well-maintained Maruti Swift VXI 2018 model in excellent condition. Single owner, all services done at authorized service center. Ready for immediate transfer.",
    specifications: {
      make: "Maruti Suzuki",
      model: "Swift VXI",
      year: 2018,
      kilometers: "42,000 km",
      fuelType: "Petrol",
      transmission: "Manual",
      insurance: "Valid till March 2026",
    },
    conditionRating: 8,
    platformFees: 500,
    depositFees: 4500,
  };

  const feeStructure = [
    { category: "Two Wheeler", platform: 50, deposit: 1950 },
    { category: "Four Wheeler", platform: 500, deposit: 4500 },
    { category: "Heavy Vehicle", platform: 1000, deposit: 9000 },
    { category: "Property", platform: 1000, deposit: 14000 },
    { category: "Antiques", platform: 100, deposit: 1500 },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % auction.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + auction.images.length) % auction.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 font-sans text-sm text-foreground/60">
            <Link to="/home" className="hover:text-primary">
              Home
            </Link>
            {" / "}
            <Link to="/auctions" className="hover:text-primary">
              Auctions
            </Link>
            {" / "}
            <span className="text-foreground">{auction.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Carousel */}
            <div>
              <div className="relative bg-card border-2 border-border rounded-md overflow-hidden mb-4">
                <img
                  src={auction.images[currentImageIndex]}
                  alt={auction.title}
                  className="w-full h-96 object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-md border-2 border-border"
                >
                  ◀
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 rounded-md border-2 border-border"
                >
                  ▶
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {auction.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-1 border-2 rounded-md overflow-hidden ${
                      idx === currentImageIndex ? "border-primary" : "border-border"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Price Section */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-4 py-2 bg-gold/20 border-2 border-gold text-foreground font-courier font-bold text-sm uppercase tracking-wider mb-4">
                  🏛️ Government Verified
                </span>
                <h1 className="font-courier font-bold text-4xl uppercase tracking-wide mb-4">
                  {auction.title}
                </h1>
                <div className="h-0.5 w-32 bg-accent mb-6" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-bebas text-5xl text-primary tracking-wide">
                    ₹{auction.basePrice.toLocaleString("en-IN")}
                  </p>
                  <p className="font-sans text-sm text-muted-foreground uppercase tracking-wide">
                    Base Price
                  </p>
                </div>

                <div className="flex items-center gap-2 text-foreground/70">
                  <Users className="h-5 w-5" />
                  <span className="font-sans font-medium">
                    {auction.bidders} participants currently bidding
                  </span>
                </div>

                {/* Timer */}
                <div className="bg-secondary border-2 border-border rounded-md p-6">
                  {auction.isCooldown ? (
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-destructive mt-1" />
                      <div>
                        <p className="font-grotesk font-semibold text-lg text-destructive uppercase tracking-wide mb-1">
                          ⏰ Cooldown Period Active
                        </p>
                        <p className="font-sans text-sm text-foreground/70">
                          Bidding is temporarily paused
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-success mt-1" />
                      <div>
                        <p className="font-grotesk font-semibold text-lg text-foreground uppercase tracking-wide mb-1">
                          Bidding Active
                        </p>
                        <p className="font-sans text-sm text-foreground/70">
                          Bidding open for participation
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t-2 border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-destructive" />
                      <p className="font-bebas text-3xl text-destructive tracking-wide">
                        ⏳ {auction.timeRemaining}
                      </p>
                    </div>
                    <p className="font-sans text-xs text-foreground/60 uppercase tracking-wide mt-1">
                      Expires In
                    </p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="hero"
                  className="w-full"
                  disabled={auction.isCooldown}
                >
                  {auction.isCooldown ? "Bidding Paused" : "Add to Cart"}
                </Button>
                <p className="text-xs font-sans text-foreground/60 text-center">
                  You'll review all fees before final payment
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="overview" className="mb-12">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="font-grotesk uppercase text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="specifications" className="font-grotesk uppercase text-sm">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="fees" className="font-grotesk uppercase text-sm">
                Fees & Charges
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h3 className="font-courier font-bold text-xl uppercase tracking-wide mb-4">
                  Description
                </h3>
                <p className="font-sans text-foreground/80 leading-relaxed mb-6">
                  {auction.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-grotesk font-semibold">{auction.category}</p>
                  </div>
                  <div>
                    <p className="font-sans text-sm text-muted-foreground mb-1">
                      Condition Rating
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-6 rounded ${
                            i < auction.conditionRating ? "bg-success" : "bg-muted"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-bebas text-lg">
                        {auction.conditionRating}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h3 className="font-courier font-bold text-xl uppercase tracking-wide mb-4">
                  Vehicle Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(auction.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3 p-3 bg-secondary rounded">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-sans text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </p>
                        <p className="font-grotesk font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fees" className="mt-6">
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h3 className="font-courier font-bold text-xl uppercase tracking-wide mb-4">
                  💰 Participation Costs
                </h3>
                <div className="h-0.5 w-32 bg-accent mb-6" />
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-sans">Platform Fees:</span>
                    <span className="font-bebas text-xl">₹{auction.platformFees.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans">Deposit Fees:</span>
                    <span className="font-bebas text-xl">₹{auction.depositFees.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-0.5 bg-border" />
                  <div className="flex justify-between items-center font-bold">
                    <span className="font-grotesk uppercase">Total:</span>
                    <span className="font-bebas text-2xl text-primary">
                      ₹{(auction.platformFees + auction.depositFees).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 bg-secondary/50 p-4 rounded border border-border">
                  <p className="flex items-start gap-2 text-sm font-sans">
                    <span className="text-primary">ℹ️</span>
                    Platform fees are non-refundable
                  </p>
                  <p className="flex items-start gap-2 text-sm font-sans">
                    <span className="text-success">ℹ️</span>
                    Deposit refunded if you lose the auction
                  </p>
                </div>

                <h4 className="font-courier font-bold text-lg uppercase tracking-wide mb-4">
                  Fee Structure by Category
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full font-sans text-sm">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left p-3 font-grotesk uppercase">Category</th>
                        <th className="text-right p-3 font-grotesk uppercase">Platform Fees</th>
                        <th className="text-right p-3 font-grotesk uppercase">Deposit Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeStructure.map((fee) => (
                        <tr
                          key={fee.category}
                          className={`border-b border-border ${
                            fee.category === auction.category ? "bg-primary/10" : ""
                          }`}
                        >
                          <td className="p-3">{fee.category}</td>
                          <td className="text-right p-3">₹{fee.platform}</td>
                          <td className="text-right p-3">₹{fee.deposit.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuctionDetail;
