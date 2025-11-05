import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import logoSeal from "@/assets/logo-seal.png";

export const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src={logoSeal} alt="Auction Grid" className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="font-courier font-bold text-lg tracking-wider text-foreground uppercase">
                Auction Grid
              </span>
              <span className="font-sans text-xs text-muted-foreground -mt-1">
                Fair. Fast. Transparent.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`font-grotesk uppercase text-sm tracking-wide transition-all relative group ${
                isActive("/") ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                isActive("/") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
            <Link
              to="/auctions"
              className={`font-grotesk uppercase text-sm tracking-wide transition-all relative group ${
                isActive("/auctions") ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}
            >
              Auctions
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                isActive("/auctions") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
            <Link
              to="/about"
              className={`font-grotesk uppercase text-sm tracking-wide transition-all relative group ${
                isActive("/about") ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}
            >
              About
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                isActive("/about") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
            <Link
              to="/contact"
              className={`font-grotesk uppercase text-sm tracking-wide transition-all relative group ${
                isActive("/contact") ? "text-primary font-semibold" : "text-foreground hover:text-primary"
              }`}
            >
              Contact
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                isActive("/contact") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login" className="font-grotesk uppercase text-sm">
                Login
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup" className="font-grotesk uppercase text-sm">
                Sign Up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
