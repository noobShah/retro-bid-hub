import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuctionCard } from "@/components/AuctionCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    const { data } = await supabase
      .from('auctions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6);
    
    setAuctions(data || []);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 bg-gradient-to-br from-background to-muted">
          <div className="container mx-auto text-center">
            <h1 className="font-courier font-bold text-5xl md:text-6xl uppercase tracking-wider mb-6 text-foreground">
              Gujarat Government Auctions
            </h1>
            <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Fair. Fast. Transparent. Participate in verified government auctions from the comfort of your home.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/auctions" className="font-grotesk uppercase tracking-wide">
                  Browse Auctions
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about" className="font-grotesk uppercase tracking-wide">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Auctions */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="font-courier font-bold text-3xl uppercase tracking-wider mb-8">
              Featured Auctions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  id={auction.id}
                  title={auction.title}
                  city={auction.city}
                  category={auction.category}
                  basePrice={auction.base_price}
                  expirationDate={auction.expiration_date}
                  imageUrl={auction.images?.[0] || 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800'}
                  bidders={auction.bidders_count || 0}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
