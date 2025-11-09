import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-4">
              Privacy Policy
            </h1>
            <div className="h-0.5 w-48 bg-accent mx-auto" />
          </div>

          <section className="prose prose-invert text-foreground/80">
            <p>
              Auction Grid is committed to protecting your privacy. We collect
              only the information necessary to operate auctions and provide
              services. We never sell personal data to third parties.
            </p>

            <h3>Data We Collect</h3>
            <p>
              We may collect contact information, identification documents for
              verification, payment details, and activity logs related to your
              account.
            </p>

            <h3>How We Use Data</h3>
            <p>
              Data is used to verify users, process transactions, prevent
              fraud, and comply with legal obligations. We retain data only as
              long as necessary for these purposes.
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              For detailed information and your rights, contact our Data
              Protection Officer at privacy@hawkinfosys.example.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
