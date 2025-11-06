import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, TrendingUp, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");

  const users = [
    {
      id: "1",
      name: "Amit Sharma",
      email: "amit@mail.com",
      city: "Ahmedabad",
      role: "user",
      joinedDate: "2025-01-15",
      participations: 5,
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya@mail.com",
      city: "Surat",
      role: "user",
      joinedDate: "2025-02-03",
      participations: 3,
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@gmail.com",
      city: "N/A",
      role: "admin",
      joinedDate: "2024-01-01",
      participations: 0,
    },
    {
      id: "4",
      name: "Rajesh Kumar",
      email: "rajesh@mail.com",
      city: "Vadodara",
      role: "user",
      joinedDate: "2025-01-20",
      participations: 8,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === "all" || user.city === filterCity;
    return matchesSearch && matchesCity;
  });

  const stats = [
    { label: "Total Users", value: "1,432", icon: Users },
    { label: "Active Today", value: "89", icon: TrendingUp },
    { label: "New This Week", value: "34", icon: UserPlus },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
            User Management
          </h1>
          <div className="h-0.5 w-48 bg-accent" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <p className="font-bebas text-3xl tracking-wide text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="Surat">Surat</SelectItem>
              <SelectItem value="Vadodara">Vadodara</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border-2 border-border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-grotesk">Name</TableHead>
                <TableHead className="font-grotesk">Email</TableHead>
                <TableHead className="font-grotesk">City</TableHead>
                <TableHead className="font-grotesk">Role</TableHead>
                <TableHead className="font-grotesk">Joined Date</TableHead>
                <TableHead className="font-grotesk">Participations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge className="bg-purple-600">Admin</Badge>
                    ) : (
                      <Badge variant="secondary">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell>{user.participations}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
