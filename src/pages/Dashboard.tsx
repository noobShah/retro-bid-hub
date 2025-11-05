import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle, Mail, CreditCard } from "lucide-react";

interface Auction {
  id: string;
  title: string;
  image: string;
  basePrice: number;
  category: string;
  status: "active" | "won" | "lost";
  currentBidders?: number;
  expiresIn?: string;
  deposit?: number;
  winningBid?: number;
  paymentStatus?: string;
  refundStatus?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState("");

  // Mock data (in production, fetch from backend)
  const [auctions, setAuctions] = useState<Auction[]>([
    {
      id: "1",
      title: "Maruti Swift VXI 2018",
      image: "/placeholder.svg",
      basePrice: 120000,
      category: "Four Wheeler",
      status: "active",
      currentBidders: 28,
      expiresIn: "1d 8h 23m",
      deposit: 5000,
    },
    {
      id: "2",
      title: "Royal Enfield Classic 350",
      image: "/placeholder.svg",
      basePrice: 85000,
      category: "Two Wheeler",
      status: "won",
      winningBid: 135000,
      paymentStatus: "pending",
      deposit: 2000,
    },
    {
      id: "3",
      title: "Honda City 2017",
      image: "/placeholder.svg",
      basePrice: 350000,
      category: "Four Wheeler",
      status: "lost",
      winningBid: 412000,
      refundStatus: "completed",
      deposit: 5000,
    },
  ]);

  const participatingAuctions = auctions.filter((a) => a.status === "active");
  const wonAuctions = auctions.filter((a) => a.status === "won");
  const lostAuctions = auctions.filter((a) => a.status === "lost");

  const handleExitAuction = (id: string) => {
    setSelectedAuction(id);
    setShowExitModal(true);
  };

  const confirmExit = () => {
    if (selectedAuction) {
      setAuctions(
        auctions.map((a) =>
          a.id === selectedAuction ? { ...a, status: "lost" as const, refundStatus: "processing" } : a
        )
      );
      toast.success("Exited auction. Deposit will be refunded in 5-7 days.");
      
      // Simulate email
      console.log("📧 EMAIL SENT: Refund Confirmation");
      setShowExitModal(false);
      setSelectedAuction(null);
    }
  };

  const viewEmail = (type: "participation" | "refund" | "won", auction: Auction) => {
    let content = "";
    
    if (type === "participation") {
      content = `Subject: Auction Participation Confirmed - ${auction.title}

Dear User,

✅ Your participation in the following auction has been confirmed:

Auction Details:
━━━━━━━━━━━━━━━━━━━━━━━
- Title: ${auction.title}
- Base Price: ₹${auction.basePrice.toLocaleString()}
- Category: ${auction.category}

Your Payment:
━━━━━━━━━━━━━━━━━━━━━━━
- Platform Fees: ₹500 (Non-refundable)
- Deposit: ₹${auction.deposit?.toLocaleString()} (Refundable if you lose)

Best regards,
Auction Grid Team`;
    } else if (type === "refund") {
      content = `Subject: Auction Closed - Refund Initiated

Dear User,

The auction you participated in has concluded:

Auction: ${auction.title}
Result: Another bidder won this auction

💰 REFUND DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━
- Deposit Amount: ₹${auction.deposit?.toLocaleString()}
- Refund Status: ${auction.refundStatus === "completed" ? "Completed" : "Processing"}
- Expected in: 5-7 business days

Thank you for participating!

Auction Grid Team`;
    } else if (type === "won") {
      content = `Subject: 🎉 Congratulations! You Won the Auction

Dear User,

🏆 CONGRATULATIONS! You are the winning bidder!

Auction Details:
━━━━━━━━━━━━━━━━━━━━━━━
- Item: ${auction.title}
- Your Winning Bid: ₹${auction.winningBid?.toLocaleString()}
- Deposit Paid: ₹${auction.deposit?.toLocaleString()}

⏰ PAYMENT SCHEDULE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stage 1: 20% within 48 hours
  Amount: ₹${((auction.winningBid || 0) * 0.2).toLocaleString()}
  
Stage 2: 80% within 60 days
  Amount: ₹${((auction.winningBid || 0) * 0.8).toLocaleString()}

⚠️ IMPORTANT WARNING:
Failure to complete payment will result in:
- Forfeiture of ₹${auction.deposit?.toLocaleString()} deposit
- Legal action as per Indian law
- Ban from future government auctions

Congratulations again!
Auction Grid Team`;
    }
    
    setEmailContent(content);
    setShowEmailModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider text-foreground mb-2">
              👤 My Auctions Dashboard
            </h1>
            <div className="h-0.5 w-32 bg-accent mx-auto" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="participating" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="participating">Participating ({participatingAuctions.length})</TabsTrigger>
              <TabsTrigger value="won">Won ({wonAuctions.length})</TabsTrigger>
              <TabsTrigger value="lost">Lost ({lostAuctions.length})</TabsTrigger>
            </TabsList>

            {/* Participating Tab */}
            <TabsContent value="participating">
              {participatingAuctions.length === 0 ? (
                <div className="text-center py-16 bg-card border-2 border-border rounded-md">
                  <p className="text-lg text-muted-foreground mb-4">🔍 No Active Auctions</p>
                  <p className="text-sm text-muted-foreground mb-6">Start exploring government auctions today!</p>
                  <Button onClick={() => navigate("/auctions")}>Explore Auctions</Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {participatingAuctions.map((auction) => (
                    <div key={auction.id} className="bg-card border-2 border-border rounded-md overflow-hidden hover:shadow-lg transition-shadow">
                      <img src={auction.image} alt={auction.title} className="w-full h-48 object-cover" />
                      <div className="p-4 space-y-3">
                        <h3 className="font-sans font-semibold text-lg">{auction.title}</h3>
                        <div className="h-px bg-border" />
                        <div className="space-y-2 text-sm font-sans">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-success font-semibold">🟢 ACTIVE</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span>₹{auction.basePrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Your Deposit:</span>
                            <span>₹{auction.deposit?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Bidders:</span>
                            <span>{auction.currentBidders}</span>
                          </div>
                          <div className="flex justify-between text-primary">
                            <span>⏰ Expires in:</span>
                            <span className="font-semibold">{auction.expiresIn}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/auction/${auction.id}`)}>
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleExitAuction(auction.id)}>
                            Exit ⚠️
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Won Tab */}
            <TabsContent value="won">
              {wonAuctions.length === 0 ? (
                <div className="text-center py-16 bg-card border-2 border-border rounded-md">
                  <p className="text-lg text-muted-foreground">No won auctions yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wonAuctions.map((auction) => (
                    <div key={auction.id} className="bg-card border-2 border-primary rounded-md overflow-hidden hover:shadow-lg transition-shadow">
                      <img src={auction.image} alt={auction.title} className="w-full h-48 object-cover" />
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏆</span>
                          <h3 className="font-sans font-semibold text-lg">{auction.title}</h3>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="space-y-2 text-sm font-sans">
                          <div className="flex justify-between">
                            <span>Winning Bid:</span>
                            <span className="font-bold text-primary">₹{auction.winningBid?.toLocaleString()}</span>
                          </div>
                          <div className="bg-muted/50 p-3 rounded space-y-1">
                            <p className="font-semibold">💰 Payment Status:</p>
                            <p>Stage 1 (20%): <span className="text-orange-600">⏳ Pending</span></p>
                            <p className="text-xs text-muted-foreground">Due: 2d 14h remaining</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-2">
                          <Button size="sm" onClick={() => navigate(`/auction/${auction.id}`)}>
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => viewEmail("won", auction)}>
                            <Mail className="h-4 w-4 mr-2" />
                            View Email
                          </Button>
                          <Button variant="ghost" size="sm" className="text-primary">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Proceed to Payment
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Lost Tab */}
            <TabsContent value="lost">
              {lostAuctions.length === 0 ? (
                <div className="text-center py-16 bg-card border-2 border-border rounded-md">
                  <p className="text-lg text-muted-foreground">No lost auctions</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostAuctions.map((auction) => (
                    <div key={auction.id} className="bg-card border-2 border-border rounded-md overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                      <img src={auction.image} alt={auction.title} className="w-full h-48 object-cover grayscale" />
                      <div className="p-4 space-y-3">
                        <h3 className="font-sans font-semibold text-lg">{auction.title}</h3>
                        <div className="h-px bg-border" />
                        <div className="space-y-2 text-sm font-sans">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-destructive">❌ Lost</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Winning Bid:</span>
                            <span>₹{auction.winningBid?.toLocaleString()}</span>
                          </div>
                          <div className="bg-success/10 p-3 rounded space-y-1">
                            <p className="font-semibold">💰 Refund Status:</p>
                            <p className="text-success">✅ {auction.refundStatus === "completed" ? "Completed" : "Processing"}</p>
                            <p className="text-xs">Deposit (₹{auction.deposit?.toLocaleString()}) refunded</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/auction/${auction.id}`)}>
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => viewEmail("refund", auction)}>
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Exit Auction Modal */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Exit Auction?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to exit this auction?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>• Platform fee (₹500) is lost</p>
            <p>• Deposit (₹4,500) will be refunded in 5-7 days</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowExitModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmExit} className="flex-1">
              Yes, Exit Auction
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notification
            </DialogTitle>
            <DialogDescription>
              This is a simulated email notification
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded font-mono text-xs whitespace-pre-wrap">
            {emailContent}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
