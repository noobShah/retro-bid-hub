import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, List, ShieldCheck, DollarSign } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { label: "Active Listings", value: "247", icon: List, color: "text-primary" },
    { label: "Total Users", value: "1,432", icon: Users, color: "text-blue-600" },
    { label: "Admins", value: "18", icon: ShieldCheck, color: "text-purple-600" },
    { label: "Revenue", value: "₹4.2L", icon: DollarSign, color: "text-green-600" },
  ];

  const recentActivity = [
    { text: "User Rajesh Kumar joined auction: Maruti Swift VXI 2018", time: "2 mins ago" },
    { text: "Admin added new listing: 2BHK Apartment Surat", time: "15 mins ago" },
    { text: "Auction expired: Royal Enfield Classic 350 - Winner: Priya Patel", time: "1 hour ago" },
    { text: "User Amit Sharma exited auction: Honda City 2019", time: "3 hours ago" },
    { text: "New user registration: Kiran Desai from Vadodara", time: "5 hours ago" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
            Admin Dashboard
          </h1>
          <div className="h-0.5 w-48 bg-accent" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-sans text-sm text-muted-foreground mb-2">
                        {stat.label}
                      </p>
                      <p className="font-bebas text-4xl tracking-wide text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-grotesk text-2xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-sans text-sm text-foreground">{activity.text}</p>
                    <p className="font-sans text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
