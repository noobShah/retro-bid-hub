import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await login(formData.email, formData.password);
    setIsLoading(false);

    if (!error) {
      toast.success("Login successful!");
      // Navigation handled by useEffect
    } else {
      toast.error(error.message || "Invalid credentials");
    }
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
                Email Address
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
                Password
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
            <Button type="submit" className="w-full font-grotesk uppercase tracking-wide" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
