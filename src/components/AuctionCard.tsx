import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, Users } from "lucide-react";
import { useAuctionTimer } from "@/hooks/useAuctionTimer";

interface AuctionCardProps {
  id: string;
  title: string;
  city: string;
  category: string;
  basePrice: number;
  expirationDate: string;
  imageUrl: string;
  isPaused?: boolean;
  bidders?: number;
}

export const AuctionCard = ({
  id,
  title,
  city,
  category,
  basePrice,
  expirationDate,
  imageUrl,
  isPaused = false,
  bidders = 0,
}: AuctionCardProps) => {
  const { timeRemaining } = useAuctionTimer(expirationDate);

  return (
    <div className="bg-card border-2 border-border rounded-md overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)] transition-all duration-200 hover:-translate-y-1 group">
      <div className="relative overflow-hidden h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isPaused && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">PAUSED</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-grotesk font-semibold text-lg text-foreground line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="font-sans text-xs">{city}</Badge>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-sans text-xs">{category}</Badge>
            {category === "Property" && (
              <span className="text-xs text-muted-foreground font-sans">Builders & contractors only</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bebas text-2xl text-primary tracking-wide">
            ₹{basePrice.toLocaleString("en-IN")}
          </p>
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide">
            Base Price
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="font-sans">{timeRemaining}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="font-sans">{bidders}</span>
          </div>
        </div>

        <Button variant="outline" className="w-full font-grotesk uppercase text-xs tracking-wide" asChild>
          <Link to={`/auction/${id}`}>View Details →</Link>
        </Button>
      </div>
    </div>
  );
};
