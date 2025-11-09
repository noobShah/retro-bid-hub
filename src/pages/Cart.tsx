import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { calculateFees, AuctionCategory } from "@/lib/feeCalculator";

// Fee structure data
const feeStructure = [
  { category: "Two Wheeler", platformFees: 50, depositFees: 1950 },
  { category: "Four Wheeler", platformFees: 500, depositFees: 4500 },
  { category: "Heavy Vehicle", platformFees: 1000, depositFees: 9000 },
  { category: "Property", platformFees: 1000, depositFees: 14000 },
  { category: "Antiques", platformFees: 100, depositFees: 1500 },
];

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreements, setAgreements] = useState({
    readTerms: false,
    understandPayment: false,
    acceptRefund: false,
  });
  const [checkoutData, setCheckoutData] = useState({
    agreementDoc: "",
    businessProof: "",
    reasonOfInterest: "",
  });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, [isAuthenticated, navigate]);

  const totalPlatformFees = cartItems.reduce((sum, item) => {
    const fees = calculateFees(item.category as AuctionCategory);
    return sum + fees.platform;
  }, 0);
  
  const totalDepositFees = cartItems.reduce((sum, item) => {
    const fees = calculateFees(item.category as AuctionCategory);
    return sum + fees.deposit;
  }, 0);
  
  const grandTotal = totalPlatformFees + totalDepositFees;

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  const handleProceed = async () => {
    if (!agreements.readTerms || !agreements.understandPayment || !agreements.acceptRefund) {
      toast.error("Please agree to all terms to proceed");
      return;
    }

    if (!checkoutData.agreementDoc || !checkoutData.businessProof || !checkoutData.reasonOfInterest) {
      toast.error("Please fill in all checkout fields");
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      // Create participation records for each cart item
      for (const item of cartItems) {
        const fees = calculateFees(item.category as AuctionCategory);
        
        const { error } = await supabase
          .from("participations")
          .insert({
            user_id: user.id,
            auction_id: item.id,
            platform_fee: fees.platform,
            deposit_fee: fees.deposit,
            status: "active",
            agreement_document: checkoutData.agreementDoc,
            business_proof: checkoutData.businessProof,
            reason_of_interest: checkoutData.reasonOfInterest,
          });

        if (error) throw error;
      }

      // Clear cart
      localStorage.removeItem("cart");
      
      toast.success("Participation Confirmed!", {
        description: "Check your dashboard for auction updates",
      });

      setShowTermsModal(false);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Failed to confirm participation: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider text-foreground mb-2">
              🛒 Your Auction Cart
            </h1>
            <div className="h-0.5 w-32 bg-accent mx-auto" />
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
              <Button onClick={() => navigate("/auctions")}>Explore Auctions</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h2 className="font-grotesk text-xl font-semibold mb-4">Selected Auctions</h2>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0">
                    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-sans font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">Base Price: ₹{item.basePrice.toLocaleString()}</p>
                      <p className="text-muted-foreground text-sm">Category: {item.category}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h2 className="font-grotesk text-xl font-semibold mb-4 flex items-center gap-2">
                  💰 Cost Breakdown
                </h2>
                <div className="space-y-3 font-sans">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      Platform Fees
                      <span className="text-muted-foreground text-xs">(Non-refundable)</span>
                    </span>
                    <span className="font-semibold">₹{totalPlatformFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      Deposit Fees
                      <span className="text-muted-foreground text-xs">(Refundable if you lose)</span>
                    </span>
                    <span className="font-semibold">₹{totalDepositFees.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Fee Structure Table */}
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h2 className="font-grotesk text-xl font-semibold mb-4">📋 Fee Structure Reference</h2>
                <div className="overflow-x-auto">
                  <table className="w-full font-sans text-sm">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-2">Category</th>
                        <th className="text-right py-2">Platform Fees</th>
                        <th className="text-right py-2">Deposit Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeStructure.map((row) => (
                        <tr key={row.category} className="border-b border-border/50">
                          <td className="py-2">{row.category}</td>
                          <td className="text-right">₹{row.platformFees.toLocaleString()}</td>
                          <td className="text-right">₹{row.depositFees.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="bg-card border-2 border-border rounded-md p-6">
                <h2 className="font-grotesk text-xl font-semibold mb-4">Participation Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="agreementDoc">Auction Participant Agreement Document *</Label>
                    <Input
                      id="agreementDoc"
                      placeholder="Document number or reference"
                      value={checkoutData.agreementDoc}
                      onChange={(e) => setCheckoutData({...checkoutData, agreementDoc: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessProof">Business/Job Proof *</Label>
                    <Input
                      id="businessProof"
                      placeholder="Company name or employment details"
                      value={checkoutData.businessProof}
                      onChange={(e) => setCheckoutData({...checkoutData, businessProof: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reasonOfInterest">Reason of Interest *</Label>
                    <Select 
                      value={checkoutData.reasonOfInterest} 
                      onValueChange={(value) => setCheckoutData({...checkoutData, reasonOfInterest: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="charity">Charity</SelectItem>
                        <SelectItem value="procurement">Procurement</SelectItem>
                        <SelectItem value="collectibles">Collectibles</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Proceed Button */}
              <Button onClick={() => setShowTermsModal(true)} className="w-full" size="lg">
                Review Terms & Conditions
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-courier text-2xl flex items-center gap-2">
              ⚖️ Auction Participation Agreement
            </DialogTitle>
            <DialogDescription className="sr-only">
              Terms and conditions for auction participation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 font-sans text-sm">
            <div>
              <h3 className="font-bold mb-2">1. FEE POLICY</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Platform fees are <strong>NON-REFUNDABLE</strong></li>
                <li>Deposit fees will be <strong>REFUNDED</strong> if you lose the auction</li>
                <li>If you WIN, deposit will be <strong>ADJUSTED</strong> in the final price</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">2. PAYMENT SCHEDULE FOR WINNERS</h3>
              <p className="text-muted-foreground mb-2">As per Indian Government regulations:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>⏰ <strong>20% within 48 hours</strong> of winning</li>
                <li>⏰ <strong>80% within next 60 days</strong></li>
                <li>⏰ <strong>+30 days grace period</strong> available</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">3. CONSEQUENCES OF NON-PAYMENT</h3>
              <p className="text-muted-foreground mb-2">Failure to complete payment within grace period will result in:</p>
              <ul className="list-disc pl-6 space-y-1 text-destructive">
                <li><strong>FORFEITURE</strong> of deposit amount</li>
                <li><strong>LEGAL ACTION</strong> as per government law</li>
                <li><strong>BAN</strong> from future auctions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">4. AUCTION RULES</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Cooldown periods apply</li>
                <li>Bidding closes at expiration time</li>
                <li>Highest bidder at closing wins</li>
                <li>Decision by government is <strong>FINAL</strong></li>
              </ul>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="readTerms"
                  checked={agreements.readTerms}
                  onCheckedChange={(checked) =>
                    setAgreements({ ...agreements, readTerms: checked as boolean })
                  }
                />
                <label htmlFor="readTerms" className="text-sm cursor-pointer">
                  I have read and agree to all terms
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="understandPayment"
                  checked={agreements.understandPayment}
                  onCheckedChange={(checked) =>
                    setAgreements({ ...agreements, understandPayment: checked as boolean })
                  }
                />
                <label htmlFor="understandPayment" className="text-sm cursor-pointer">
                  I understand the payment schedule
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptRefund"
                  checked={agreements.acceptRefund}
                  onCheckedChange={(checked) =>
                    setAgreements({ ...agreements, acceptRefund: checked as boolean })
                  }
                />
                <label htmlFor="acceptRefund" className="text-sm cursor-pointer">
                  I accept the refund policy
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowTermsModal(false)} className="flex-1" disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleProceed} className="flex-1" disabled={loading}>
                {loading ? "Processing..." : "I Agree & Proceed"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Cart;
