import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, Package, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AdminReports = () => {
  const cityData = [
    { city: "Ahmedabad", count: 67, percentage: 67 },
    { city: "Surat", count: 52, percentage: 52 },
    { city: "Vadodara", count: 41, percentage: 41 },
    { city: "Rajkot", count: 35, percentage: 35 },
    { city: "Bhavnagar", count: 28, percentage: 28 },
  ];

  const categoryPerformance = [
    { category: "Four Wheeler", listings: 123, wonPercentage: 45 },
    { category: "Property", listings: 89, wonPercentage: 67 },
    { category: "Two Wheeler", listings: 67, wonPercentage: 52 },
    { category: "Heavy Vehicle", listings: 34, wonPercentage: 38 },
    { category: "Antiques", listings: 21, wonPercentage: 71 },
  ];

  const overallStats = [
    { label: "Total Revenue", value: "₹42.3L", icon: TrendingUp, change: "+12.5%" },
    { label: "Total Listings", value: "334", icon: Package, change: "+8.2%" },
    { label: "Active Cities", value: "10", icon: MapPin, change: "+0%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
              Reports & Analytics
            </h1>
            <div className="h-0.5 w-48 bg-accent" />
          </div>
          <Select defaultValue="30">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="365">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {overallStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-sans text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="font-bebas text-3xl tracking-wide text-foreground mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-sans text-xs text-green-600">{stat.change} from last period</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* City-wise Distribution */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-grotesk text-2xl">
              City-wise Auction Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cityData.map((city) => (
              <div key={city.city} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-sans font-medium">{city.city}</span>
                  <span className="font-sans text-muted-foreground">{city.count} listings</span>
                </div>
                <Progress value={city.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-grotesk text-2xl">
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryPerformance.map((category) => (
                <div
                  key={category.category}
                  className="flex items-center justify-between p-4 bg-secondary rounded-md"
                >
                  <div className="flex-1">
                    <p className="font-sans font-semibold text-foreground">
                      {category.category}
                    </p>
                    <p className="font-sans text-sm text-muted-foreground">
                      {category.listings} listings
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bebas text-2xl text-foreground">
                      {category.wonPercentage}%
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">Win Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export as PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export as Excel
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
