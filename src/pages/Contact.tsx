import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-4">
              Contact Us
            </h1>
            <div className="h-0.5 w-48 bg-accent mx-auto mb-4" />
            <p className="font-sans text-foreground/70">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-sans font-medium">Name</Label>
                <Input id="name" type="text" required className="border-2 mt-2" />
              </div>

              <div>
                <Label htmlFor="email" className="font-sans font-medium">Email</Label>
                <Input id="email" type="email" required className="border-2 mt-2" />
              </div>

              <div>
                <Label htmlFor="subject" className="font-sans font-medium">Subject</Label>
                <Input id="subject" type="text" required className="border-2 mt-2" />
              </div>

              <div>
                <Label htmlFor="message" className="font-sans font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  required 
                  className="border-2 mt-2 min-h-32" 
                  placeholder="Tell us how we can help..."
                />
              </div>

              <Button type="submit" className="w-full font-grotesk uppercase tracking-wide">
                Send Message
              </Button>
            </form>
          </div>

          <div className="mt-12 text-center space-y-4 font-sans text-sm text-foreground/70">
            <p>
              <strong>Email:</strong> support@auctiongrid.gov.in
            </p>
            <p>
              <strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
