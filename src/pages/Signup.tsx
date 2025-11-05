import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const gujaratCities = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", 
  "Gandhinagar", "Jamnagar", "Junagadh", "Navsari", "Valsad"
];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    city: "",
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error("Please agree to Terms & Conditions");
      return;
    }

    if (!formData.city) {
      toast.error("Please select your city");
      return;
    }

    // Store user data in localStorage (temporary)
    localStorage.setItem("user", JSON.stringify({
      ...formData,
      role: "user"
    }));

    toast.success("Account created successfully!");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-border rounded-md p-8 shadow-[var(--shadow-card)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-courier font-bold text-3xl uppercase tracking-wider text-foreground mb-2">
              Create Your Account
            </h1>
            <div className="h-0.5 w-32 bg-accent mx-auto" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-sans text-sm font-medium">
                📝 Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="font-sans border-2"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-sans text-sm font-medium">
                📧 Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="font-sans border-2"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-sans text-sm font-medium">
                🔒 Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="font-sans border-2"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="font-sans text-sm font-medium">
                🏙️ City (Gujarat Only)
              </Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {gujaratCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-sans text-foreground/80 cursor-pointer"
              >
                I agree to{" "}
                <Link to="/terms" className="text-primary underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full font-grotesk uppercase tracking-wide">
              Sign Up
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm font-sans text-foreground/70">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
