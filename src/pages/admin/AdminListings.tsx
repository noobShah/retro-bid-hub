import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus, Search, Eye, Pencil, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const AdminListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const listings = [
    {
      id: "1",
      title: "Maruti Swift VXI 2018",
      city: "Ahmedabad",
      category: "Four Wheeler",
      status: "active",
      bidders: 23,
      basePrice: 120000,
    },
    {
      id: "2",
      title: "Plot Sector-21 Surat",
      city: "Surat",
      category: "Property",
      status: "active",
      bidders: 31,
      basePrice: 2500000,
    },
    {
      id: "3",
      title: "Royal Enfield Bullet 350",
      city: "Vadodara",
      category: "Two Wheeler",
      status: "expired",
      bidders: 18,
      basePrice: 85000,
    },
    {
      id: "4",
      title: "Honda City 2019",
      city: "Rajkot",
      category: "Four Wheeler",
      status: "cooldown",
      bidders: 15,
      basePrice: 450000,
    },
  ];

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === "all" || listing.city === filterCity;
    const matchesCategory = filterCategory === "all" || listing.category === filterCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "cooldown":
        return <Badge className="bg-yellow-600">Cooldown</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
              Manage Listings
            </h1>
            <div className="h-0.5 w-48 bg-accent" />
          </div>
          <Button asChild>
            <Link to="/admin/add-listing" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
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
              <SelectItem value="Rajkot">Rajkot</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Two Wheeler">Two Wheeler</SelectItem>
              <SelectItem value="Four Wheeler">Four Wheeler</SelectItem>
              <SelectItem value="Property">Property</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border-2 border-border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-grotesk">Title</TableHead>
                <TableHead className="font-grotesk">City</TableHead>
                <TableHead className="font-grotesk">Category</TableHead>
                <TableHead className="font-grotesk">Base Price</TableHead>
                <TableHead className="font-grotesk">Status</TableHead>
                <TableHead className="font-grotesk">Bidders</TableHead>
                <TableHead className="font-grotesk text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">{listing.title}</TableCell>
                  <TableCell>{listing.city}</TableCell>
                  <TableCell>{listing.category}</TableCell>
                  <TableCell>₹{listing.basePrice.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{getStatusBadge(listing.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {listing.bidders}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="h-4 w-4 mr-2" />
                          View Participants ({listing.bidders})
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminListings;
