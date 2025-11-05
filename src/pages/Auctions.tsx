import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuctionCard } from "@/components/AuctionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import auctionCar from "@/assets/auction-car-1.jpg";
import auctionBike from "@/assets/auction-bike-1.jpg";
import auctionProperty from "@/assets/auction-property-1.jpg";
const gujaratCities = ["All Cities", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Gandhinagar", "Jamnagar", "Junagadh", "Navsari", "Valsad"];
const Auctions = () => {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [categories, setCategories] = useState({
    twoWheeler: false,
    fourWheeler: false,
    heavyVehicle: false,
    property: false,
    antiques: false
  });
  const [showPaused, setShowPaused] = useState(false);
  const [sortBy, setSortBy] = useState("bidders_desc");

  // Mock auction data
  const allAuctions = [{
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
  }, {
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
  const handleCategoryChange = (category: keyof typeof categories) => {
    setCategories({
      ...categories,
      [category]: !categories[category]
    });
  };
  const clearFilters = () => {
    setSelectedCity("All Cities");
    setPriceRange([0, 10000000]);
    setCategories({
      twoWheeler: false,
      fourWheeler: false,
      heavyVehicle: false,
      property: false,
      antiques: false
    });
    setShowPaused(false);
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
              All Auctions
            </h1>
            <p className="font-sans text-foreground/70">
              Browse government-approved auctions across Gujarat
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-secondary border-2 border-border rounded-md p-6 sticky top-20">
                <div className="mb-6">
                  <h2 className="font-courier font-bold text-xl uppercase tracking-wider mb-1">FILTER AUCTIONS</h2>
                  <div className="h-0.5 w-24 bg-accent" />
                </div>

                <div className="space-y-6">
                  {/* City */}
                  <div>
                    <Label className="font-sans font-semibold mb-2 block">🏙️ City</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gujaratCities.map(city => <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="font-sans font-semibold mb-3 block">💰 Price Range</Label>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={10000000} step={50000} className="mb-3" />
                    <div className="flex justify-between text-xs font-sans text-foreground/70">
                      <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                      <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="font-sans font-semibold mb-3 block">📂 Category</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="twoWheeler" checked={categories.twoWheeler} onCheckedChange={() => handleCategoryChange("twoWheeler")} />
                        <label htmlFor="twoWheeler" className="text-sm font-sans cursor-pointer">
                          Two Wheeler
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="fourWheeler" checked={categories.fourWheeler} onCheckedChange={() => handleCategoryChange("fourWheeler")} />
                        <label htmlFor="fourWheeler" className="text-sm font-sans cursor-pointer">
                          Four Wheeler
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="heavyVehicle" checked={categories.heavyVehicle} onCheckedChange={() => handleCategoryChange("heavyVehicle")} />
                        <label htmlFor="heavyVehicle" className="text-sm font-sans cursor-pointer">
                          Heavy Vehicle
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="property" checked={categories.property} onCheckedChange={() => handleCategoryChange("property")} />
                        <label htmlFor="property" className="text-sm font-sans cursor-pointer">
                          Property
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="antiques" checked={categories.antiques} onCheckedChange={() => handleCategoryChange("antiques")} />
                        <label htmlFor="antiques" className="text-sm font-sans cursor-pointer">
                          Antiques
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cooldown */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="paused" checked={showPaused} onCheckedChange={checked => setShowPaused(checked as boolean)} />
                      <label htmlFor="paused" className="text-sm font-sans cursor-pointer">
                        ⏸️ Show only paused
                      </label>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2 pt-4">
                    <Button className="w-full font-grotesk uppercase text-xs tracking-wide">
                      Apply Filters
                    </Button>
                    <Button variant="outline" className="w-full font-grotesk uppercase text-xs tracking-wide" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Auction Grid */}
            <div className="lg:col-span-3">
              {/* Sort Options */}
              <div className="mb-6 flex items-center gap-4">
                <span className="font-sans text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bidders_desc">Most Bidders</SelectItem>
                    <SelectItem value="bidders_asc">Least Bidders</SelectItem>
                    <SelectItem value="time_asc">Expiring Soon</SelectItem>
                    <SelectItem value="time_desc">Most Time Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allAuctions.map(auction => <AuctionCard key={auction.id} {...auction} />)}
              </div>

              {/* Empty State */}
              {allAuctions.length === 0 && <div className="text-center py-16">
                  <p className="font-sans text-foreground/60">No auctions match your filters</p>
                </div>}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default Auctions;