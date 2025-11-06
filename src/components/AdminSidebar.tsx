import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, List, PlusCircle, Users, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/listings", label: "All Listings", icon: List },
    { path: "/admin/add-listing", label: "Add New Listing", icon: PlusCircle },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[hsl(var(--deep-slate))] text-white min-h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-courier font-bold text-xl uppercase tracking-wider mb-1">
          Admin Panel
        </h2>
        <div className="h-0.5 w-24 bg-accent" />
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md font-sans text-sm transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-md font-sans text-sm hover:bg-white/10 transition-colors w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
