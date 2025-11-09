import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-4">
              Government Disclaimer
            </h1>
            <div className="h-0.5 w-48 bg-accent mx-auto" />
          </div>

          <section className="prose prose-invert text-foreground/80">
            <p>
              Auction Grid facilitates auctions in partnership with authorized
              government bodies. While we strive for accuracy, users should
              verify all listing details with the issuing agency prior to
              bidding.
            </p>

            <h3>No Warranty</h3>
            <p>
              Listings and descriptions are provided "as is". Hawk Infosys and
              the government agencies are not responsible for errors, omissions,
              or the suitability of items for any purpose.
            </p>

            <h3>Verification</h3>
            <p>
              It is the bidder's responsibility to conduct inspections and
              verify legal titles and encumbrances where applicable.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Property Auctions:</strong> Note that Property listings may have additional eligibility requirements; specifically, certain Property auctions are restricted to registered builders and contractors. Please verify eligibility and required documentation with the issuing agency before bidding.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimer;
