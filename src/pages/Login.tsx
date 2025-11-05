import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Admin login
    if (formData.email === "admin@gmail.com" && formData.password === "admin123") {
      localStorage.setItem("user", JSON.stringify({
        email: formData.email,
        role: "admin",
        fullName: "Admin User"
      }));
      toast.success("Welcome, Admin!");
      navigate("/admin");
      return;
    }

    // Regular user login (check localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === formData.email && user.password === formData.password) {
        toast.success("Login successful!");
        navigate("/home");
        return;
      }
    }

    toast.error("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-border rounded-md p-8 shadow-[var(--shadow-card)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-courier font-bold text-3xl uppercase tracking-wider text-foreground mb-2">
              Welcome Back
            </h1>
            <div className="h-0.5 w-32 bg-accent mx-auto" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="font-sans border-2"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full font-grotesk uppercase tracking-wide">
              Login
            </Button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center text-sm font-sans">
            <p className="text-foreground/70">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium underline">
                Sign Up
              </Link>
            </p>
            <Link to="/forgot-password" className="text-primary/80 hover:text-primary block">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
