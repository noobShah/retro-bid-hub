import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "admin") {
      navigate("/home");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};
