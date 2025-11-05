import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Users, Clock } from "lucide-react";

interface AuctionCardProps {
  id: string;
  title: string;
  image: string;
  basePrice: number;
  bidders: number;
  timeRemaining: string;
  category: string;
}

export const AuctionCard = ({
  id,
  title,
  image,
  basePrice,
  bidders,
  timeRemaining,
  category,
}: AuctionCardProps) => {
  return (
    <div className="bg-card border-2 border-border rounded-md overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] transition-all duration-200 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Verified Badge */}
        <div className="absolute top-2 right-2">
          <span className="inline-block px-3 py-1 bg-gold/90 border border-gold text-foreground font-courier font-bold text-xs uppercase tracking-wider">
            ✓ Verified
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-grotesk font-semibold text-lg text-foreground line-clamp-1">
          {title}
        </h3>

        <div className="h-0.5 w-16 bg-accent/50" />

        <div className="space-y-2">
          <p className="font-bebas text-2xl text-primary tracking-wide">
            ₹{basePrice.toLocaleString("en-IN")}
          </p>
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
            Base Price
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-foreground/70">
            <Users className="h-4 w-4" />
            <span className="font-sans">{bidders} Bidders</span>
          </div>
          <div className="flex items-center gap-1 text-destructive">
            <Clock className="h-4 w-4" />
            <span className="font-sans font-medium">{timeRemaining}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full font-grotesk uppercase text-xs tracking-wide" asChild>
          <Link to={`/auction/${id}`}>View Details →</Link>
        </Button>
      </div>
    </div>
  );
};
