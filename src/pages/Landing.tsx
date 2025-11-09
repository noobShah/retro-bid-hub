import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-landing.jpg";
const Landing = () => {
  return <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{
      backgroundImage: `url(${heroImage})`
    }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
        {/* Subtle Grain Texture */}
        <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Retro Frame */}
        <div className="border-4 border-accent/20 p-12 mb-8 relative">
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-gold -mt-2 -ml-2" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-gold -mt-2 -mr-2" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-gold -mb-2 -ml-2" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-gold -mb-2 -mr-2" />
          
          {/* Logo (from public/logo.png) */}
          <img src="/logo.png" alt="Auction Grid logo" className="mx-auto mb-6 w-60 h-auto object-contain" />

          <h1 className="font-courier font-bold text-5xl md:text-7xl uppercase tracking-[0.2em] mb-4 text-foreground">AUCTION GRID</h1>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-0.5 w-24 bg-accent" />
            <p className="font-grotesk text-xl md:text-2xl tracking-wide text-accent">
              Fair. Fast. Transparent.
            </p>
            <div className="h-0.5 w-24 bg-accent" />
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <p className="font-grotesk text-2xl md:text-3xl font-medium text-foreground">
            Government-Approved Auctions <br/>(for college project purposes only)
          </p>
          <p className="font-sans text-lg md:text-xl text-foreground/80">
            Across India
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/home">Explore Auctions →</Link>
          </Button>
          <Button variant="outline_hero" size="lg" asChild>
            <Link to="/login">Login / Sign Up</Link>
          </Button>
        </div>

        {/* Verification Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm">
          <span className="inline-block px-4 py-2 bg-gold/20 border-2 border-gold text-foreground font-courier font-bold uppercase tracking-wider">
            ✓ Government Verified
          </span>
        </div>
      </div>
    </div>;
};
export default Landing;