import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useAuctionTimer } from "@/hooks/useAuctionTimer";
import { useBidding } from "@/hooks/useBidding";

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const { timeRemaining } = useAuctionTimer(auction?.expiration_date);
  const { bids, currentBid, loading: biddingLoading, placeBid } = useBidding(id || "");

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Failed to load auction details");
        navigate("/auctions");
        return;
      }

      setAuction(data);
      
      // Check cooldown status
      const now = new Date();
      const expirationDate = new Date(data.expiration_date);
      const cooldownEnd = new Date(expirationDate.getTime() + (data.cooldown_hours || 0) * 60 * 60 * 1000);
      setIsInCooldown(now < cooldownEnd && now > expirationDate);
      
      setLoading(false);
    };

    fetchAuction();
  }, [id, navigate]);

  const handlePlaceBid = async () => {
    if (!bidAmount) {
      toast.error("Please enter a bid amount");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      toast.error("Please enter a valid number");
      return;
    }

    const success = await placeBid(amount);
    if (success) {
      setBidAmount("");
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to participate in auctions");
      navigate("/login");
      return;
    }

    if (isInCooldown) {
      toast.error("This auction is in cooldown period");
      return;
    }

    // Store auction in localStorage for cart
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    
    // Check if already in cart
    if (cartItems.find((item: any) => item.id === auction.id)) {
      toast.info("This auction is already in your cart");
      navigate("/cart");
      return;
    }

    cartItems.push({
      id: auction.id,
      title: auction.title,
      basePrice: auction.base_price,
      category: auction.category,
      image: auction.images?.[0] || "/placeholder.svg",
    });
    
    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success("Added to cart!");
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!auction) return null;

  const feeStructure = [
    { category: "Two Wheeler", platform: 50, deposit: 1950 },
    { category: "Four Wheeler", platform: 500, deposit: 4500 },
    { category: "Heavy Vehicle", platform: 1000, deposit: 9000 },
    { category: "Property", platform: 1000, deposit: 14000 },
    { category: "Antiques", platform: 100, deposit: 1500 },
  ];
  
  const currentFees = feeStructure.find(f => f.category === auction.category) || feeStructure[1];

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
                  src={auction.images?.[currentImageIndex] || "/placeholder.svg"}
                  alt={auction.title}
                  className="w-full h-96 object-cover"
                />
                {auction.images && auction.images.length > 1 && (
                  <>
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
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {auction.images && auction.images.length > 1 && (
                <div className="flex gap-2">
                  {auction.images.map((img: string, idx: number) => (
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
              )}
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
                    ₹{auction.base_price.toLocaleString("en-IN")}
                  </p>
                  <p className="font-sans text-sm text-muted-foreground uppercase tracking-wide">
                    Base Price
                  </p>
                </div>

                {currentBid > 0 && (
                  <div className="bg-primary/10 border-2 border-primary rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <p className="font-grotesk font-semibold text-sm uppercase tracking-wide">
                        Current Highest Bid
                      </p>
                    </div>
                    <p className="font-bebas text-4xl text-primary tracking-wide">
                      ₹{currentBid.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-foreground/70">
                  <Users className="h-5 w-5" />
                  <span className="font-sans font-medium">
                    {auction.bidders_count} participants • {bids.length} bids placed
                  </span>
                </div>

                {/* Timer */}
                <div className="bg-secondary border-2 border-border rounded-md p-6">
                  {isInCooldown ? (
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
                        ⏳ {timeRemaining}
                      </p>
                    </div>
                    <p className="font-sans text-xs text-foreground/60 uppercase tracking-wide mt-1">
                      {isInCooldown ? "Cooldown Ends In" : "Expires In"}
                    </p>
                  </div>
                </div>

                {/* Bidding Section */}
                {isAuthenticated && !isInCooldown && (
                  <div className="bg-secondary border-2 border-border rounded-md p-4 space-y-3">
                    <h3 className="font-grotesk font-semibold uppercase text-sm">Place Your Bid</h3>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder={`Min: ₹${(currentBid + 1).toLocaleString("en-IN")}`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handlePlaceBid}
                        disabled={biddingLoading}
                        className="px-6"
                      >
                        {biddingLoading ? "Placing..." : "Bid"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your bid must be higher than ₹{currentBid.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  variant="hero"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={isInCooldown || !isAuthenticated}
                >
                  {!isAuthenticated ? "Login to Participate" : isInCooldown ? "Bidding Paused" : "Add to Cart"}
                </Button>
                <p className="text-xs font-sans text-foreground/60 text-center">
                  {!isAuthenticated ? "You must be logged in to participate" : "You'll review all fees before final payment"}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="overview" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="font-grotesk uppercase text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="bids" className="font-grotesk uppercase text-sm">
                Bid History ({bids.length})
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
                            i < (auction.condition_rating || 0) ? "bg-success" : "bg-muted"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-bebas text-lg">
                        {auction.condition_rating || 0}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bids" className="mt-6">
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h3 className="font-courier font-bold text-xl uppercase tracking-wide mb-4">
                  🔨 Live Bid History
                </h3>
                <div className="h-0.5 w-32 bg-accent mb-6" />
                
                {bids.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-sans">No bids placed yet. Be the first to bid!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bids.map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between p-4 rounded-md border-2 ${
                          index === 0
                            ? "bg-primary/10 border-primary"
                            : "bg-secondary border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-grotesk font-semibold">
                              {bid.profiles?.full_name || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(bid.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bebas text-2xl text-primary">
                            ₹{Number(bid.amount).toLocaleString("en-IN")}
                          </p>
                          {index === 0 && (
                            <p className="text-xs font-sans text-success uppercase font-semibold">
                              Highest Bid
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h3 className="font-courier font-bold text-xl uppercase tracking-wide mb-4">
                  Item Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-sans text-xs text-muted-foreground">Years Used</p>
                      <p className="font-grotesk font-medium">{auction.years_used || "N/A"} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-sans text-xs text-muted-foreground">Insurance Status</p>
                      <p className="font-grotesk font-medium">{auction.insurance_status ? "Valid" : "Expired"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-sans text-xs text-muted-foreground">City</p>
                      <p className="font-grotesk font-medium">{auction.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-sans text-xs text-muted-foreground">Status</p>
                      <p className="font-grotesk font-medium capitalize">{auction.status}</p>
                    </div>
                  </div>
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
                    <span className="font-bebas text-xl">₹{currentFees.platform.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans">Deposit Fees:</span>
                    <span className="font-bebas text-xl">₹{currentFees.deposit.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-0.5 bg-border" />
                  <div className="flex justify-between items-center font-bold">
                    <span className="font-grotesk uppercase">Total:</span>
                    <span className="font-bebas text-2xl text-primary">
                      ₹{(currentFees.platform + currentFees.deposit).toLocaleString("en-IN")}
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
