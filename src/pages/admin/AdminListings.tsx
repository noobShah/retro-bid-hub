import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminListings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to fetch listings");
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, cooldownHours: number, createdAt: string) => {
    const hoursSinceCreation = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCreation > cooldownHours) {
      toast.error("Cannot delete auction - cooldown period has passed and auction is live");
      return;
    }

    if (confirm("Are you sure you want to delete this listing?")) {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete listing");
      } else {
        toast.success("Listing deleted successfully");
        fetchListings();
      }
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === "all" || listing.city === filterCity;
    const matchesCategory = filterCategory === "all" || listing.category === filterCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      cooldown: "secondary",
      expired: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const canModify = (createdAt: string, cooldownHours: number) => {
    const hoursSinceCreation = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hoursSinceCreation <= cooldownHours;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
              Manage Listings
            </h1>
            <div className="h-0.5 w-48 bg-accent" />
          </div>
          <Button onClick={() => navigate("/admin/add-listing")} className="font-grotesk uppercase">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                  <SelectItem value="Surat">Surat</SelectItem>
                  <SelectItem value="Vadodara">Vadodara</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Two Wheeler">Two Wheeler</SelectItem>
                  <SelectItem value="Four Wheeler">Four Wheeler</SelectItem>
                  <SelectItem value="Heavy Vehicle">Heavy Vehicle</SelectItem>
                  <SelectItem value="Property">Property</SelectItem>
                  <SelectItem value="Antiques">Antiques</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Listings Table */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-grotesk text-xl">All Listings ({filteredListings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8">Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cooldown</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map((listing) => {
                    const modifiable = canModify(listing.created_at, listing.cooldown_hours);
                    return (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell>{listing.city}</TableCell>
                        <TableCell>{listing.category}</TableCell>
                        <TableCell>₹{listing.base_price.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        <TableCell>
                          {modifiable ? (
                            <Badge variant="secondary">{listing.cooldown_hours}h</Badge>
                          ) : (
                            <Badge variant="destructive">Live</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/auction/${listing.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              {modifiable && (
                                <>
                                  <DropdownMenuItem onClick={() => navigate(`/admin/edit-listing/${listing.id}`)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(listing.id, listing.cooldown_hours, listing.created_at)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                              {!modifiable && (
                                <DropdownMenuItem disabled>
                                  <span className="text-xs text-muted-foreground">
                                    Cannot modify live auction
                                  </span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminListings;
