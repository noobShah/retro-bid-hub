import { Link } from "react-router-dom";
import logoSeal from "@/assets/logo-seal.png";

export const Footer = () => {
  return (
    <footer className="bg-secondary border-t-2 border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoSeal} alt="Auction Grid" className="h-12 w-12" />
              <div>
                <h3 className="font-courier font-bold text-xl tracking-wider text-foreground uppercase">
                  Auction Grid
                </h3>
                <p className="font-sans text-sm text-muted-foreground">
                  Fair. Fast. Transparent.
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 font-sans">
              A Government Initiative<br />
              by Hawk Infosys Pvt. Ltd.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-grotesk font-semibold text-foreground uppercase tracking-wide mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors font-sans"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/auctions"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors font-sans"
                >
                  Auctions
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors font-sans"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors font-sans"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-grotesk font-semibold text-foreground uppercase tracking-wide mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors font-sans"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors font-sans"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors font-sans"
                >
                  Government Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-muted mt-8 pt-6">
          <p className="text-center text-sm text-foreground/60 font-sans">
            © 2025 Hawk Infosys Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
