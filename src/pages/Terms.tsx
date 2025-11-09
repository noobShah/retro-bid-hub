import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-4">
              Terms & Conditions
            </h1>
            <div className="h-0.5 w-48 bg-accent mx-auto" />
          </div>

          <section className="prose prose-invert text-foreground/80">
            <p>
              These Terms and Conditions govern your use of Auction Grid. By
              accessing or using our platform you agree to be bound by these
              terms. Users must follow all applicable laws and provide accurate
              information when participating in auctions.
            </p>

            <h3>Eligibility</h3>
            <p>
              You must be at least 18 years old and able to enter into a
              binding agreement to use the service.
            </p>

            <h3>Bidding & Payments</h3>
            <p>
              All bids are legally binding. Failure to complete a purchase may
              result in account suspension and other remedies.
            </p>

            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Property Auctions:</strong> For Property category auctions, only registered builders and contractors are permitted to place bids. Users participating in Property auctions must provide valid registration and documentation as required by the listing.
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              This is a summary. For full terms please contact support or
              download the complete terms document.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
