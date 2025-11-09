import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuctionCard } from "@/components/AuctionCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const gujaratCities = ["All Cities", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Gandhinagar"];
const categories = ["Two Wheeler", "Four Wheeler", "Heavy Vehicle", "Property", "Antiques"];

const Auctions = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showPaused, setShowPaused] = useState(false);
  const [sortBy, setSortBy] = useState("none");
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchAuctions();
  }, [isAuthenticated, navigate]);

  const fetchAuctions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching auctions:', error);
    } else {
      setAuctions(data || []);
    }
    setLoading(false);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

  const clearFilters = () => {
    setSelectedCity("All Cities");
    setPriceRange([0, 10000000]);
    setSelectedCategories([]);
    setShowPaused(false);
    setSortBy("none");
  };

  const filteredAndSortedAuctions = useMemo(() => {
    let result = [...auctions];

    // City filter
    if (selectedCity !== "All Cities") {
      result = result.filter(auction => auction.city === selectedCity);
    }

    // Price filter
    result = result.filter(auction => 
      auction.base_price >= priceRange[0] && auction.base_price <= priceRange[1]
    );

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(auction => selectedCategories.includes(auction.category));
    }

    // Status filter
    if (!showPaused) {
      result = result.filter(auction => auction.status === 'active');
    }

    // Sorting
    if (sortBy === "bidders") {
      result.sort((a, b) => (b.bidders_count || 0) - (a.bidders_count || 0));
    } else if (sortBy === "time") {
      result.sort((a, b) => 
        new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime()
      );
    }

    return result;
  }, [auctions, selectedCity, priceRange, selectedCategories, showPaused, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg font-sans">Loading auctions...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
            Browse Auctions
          </h1>
          <div className="h-0.5 w-48 bg-accent" />
          <p className="font-sans text-muted-foreground mt-4">
            Explore verified government auctions from across Gujarat
          </p>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            Note: For Property category auctions, only registered builders and contractors are permitted to bid. Please ensure you meet the eligibility and registration requirements before participating in Property auctions.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-card border-2 border-border rounded-md p-6 sticky top-20">
              <h2 className="font-grotesk font-semibold text-lg uppercase tracking-wide mb-4">
                Filters
              </h2>

              {/* City Filter */}
              <div className="space-y-2 mb-6">
                <label className="font-sans text-sm font-medium">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gujaratCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3 mb-6">
                <label className="font-sans text-sm font-medium">
                  Price Range
                </label>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000000}
                    step={50000}
                    className="my-4"
                  />
                </div>
                <div className="flex justify-between font-sans text-xs text-muted-foreground">
                  <span>₹{(priceRange[0] / 100000).toFixed(1)}L</span>
                  <span>₹{(priceRange[1] / 100000).toFixed(1)}L</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3 mb-6">
                <label className="font-sans text-sm font-medium">Category</label>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <label
                      htmlFor={category}
                      className="font-sans text-sm cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>

              {/* Show Paused */}
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox
                  id="showPaused"
                  checked={showPaused}
                  onCheckedChange={(checked) => setShowPaused(checked as boolean)}
                />
                <label htmlFor="showPaused" className="font-sans text-sm cursor-pointer">
                  Show Paused Auctions
                </label>
              </div>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                className="w-full font-grotesk uppercase text-sm"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </aside>

          {/* Auctions Grid */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="mb-6 flex items-center justify-between">
              <p className="font-sans text-sm text-muted-foreground">
                {filteredAndSortedAuctions.length} auctions found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-2">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sorting</SelectItem>
                  <SelectItem value="bidders">Most Bidders</SelectItem>
                  <SelectItem value="time">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auctions Grid */}
            {filteredAndSortedAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedAuctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    id={auction.id}
                    title={auction.title}
                    city={auction.city}
                    category={auction.category}
                    basePrice={auction.base_price}
                    expirationDate={auction.expiration_date}
                    imageUrl={auction.images?.[0] || 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800'}
                    isPaused={auction.status !== 'active'}
                    bidders={auction.bidders_count || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-sans text-lg text-muted-foreground mb-4">
                  No auctions match your filters
                </p>
                <Button onClick={clearFilters} variant="outline" className="font-grotesk uppercase">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auctions;
