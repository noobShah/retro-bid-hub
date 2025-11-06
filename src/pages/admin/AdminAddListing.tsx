import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const gujaratCities = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar",
  "Gandhinagar", "Jamnagar", "Junagadh", "Navsari", "Valsad"
];

const AdminAddListing = () => {
  const navigate = useNavigate();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    city: "",
    basePrice: "",
    description: "",
    yearsUsed: "",
    conditionRating: "",
    insuranceStatus: "active",
    cooldownPeriod: "",
    expirationTime: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 7));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.city || !formData.basePrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!expirationDate) {
      toast.error("Please select an expiration date");
      return;
    }

    toast.success(isDraft ? "Listing saved as draft!" : "Listing published successfully!");
    navigate("/admin/listings");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
            Add New Auction Listing
          </h1>
          <div className="h-0.5 w-48 bg-accent" />
        </div>

        <form className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-grotesk text-xl">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Maruti Swift VXI 2018"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Two Wheeler">Two Wheeler</SelectItem>
                      <SelectItem value="Four Wheeler">Four Wheeler</SelectItem>
                      <SelectItem value="Heavy Vehicle">Heavy Vehicle</SelectItem>
                      <SelectItem value="Property">Property</SelectItem>
                      <SelectItem value="Antiques">Antiques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                    <SelectTrigger>
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
              </div>

              <div>
                <Label htmlFor="basePrice">Base Price (₹) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  placeholder="120000"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the item..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-grotesk text-xl">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="yearsUsed">Years Used</Label>
                  <Input
                    id="yearsUsed"
                    type="number"
                    value={formData.yearsUsed}
                    onChange={(e) => setFormData({ ...formData, yearsUsed: e.target.value })}
                    placeholder="5"
                  />
                </div>

                <div>
                  <Label htmlFor="conditionRating">Condition (1-10)</Label>
                  <Input
                    id="conditionRating"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.conditionRating}
                    onChange={(e) => setFormData({ ...formData, conditionRating: e.target.value })}
                    placeholder="8"
                  />
                </div>

                <div>
                  <Label>Insurance Status</Label>
                  <Select value={formData.insuranceStatus} onValueChange={(value) => setFormData({ ...formData, insuranceStatus: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auction Timing */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-grotesk text-xl">Auction Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cooldownPeriod">Cooldown Period (hours)</Label>
                  <Input
                    id="cooldownPeriod"
                    type="number"
                    value={formData.cooldownPeriod}
                    onChange={(e) => setFormData({ ...formData, cooldownPeriod: e.target.value })}
                    placeholder="24"
                  />
                </div>

                <div>
                  <Label htmlFor="expirationTime">Expiration Time</Label>
                  <Input
                    id="expirationTime"
                    type="time"
                    value={formData.expirationTime}
                    onChange={(e) => setFormData({ ...formData, expirationTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Expiration Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expirationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expirationDate}
                      onSelect={setExpirationDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-grotesk text-xl">Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
                <input
                  type="file"
                  id="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-sans text-sm text-muted-foreground">
                    Drag & Drop or Click to Upload
                  </p>
                  <p className="font-sans text-xs text-muted-foreground">
                    Max 7 images, JPG/PNG, &lt;5MB each
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border-2 border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/listings")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, true)}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
            >
              Publish Listing
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddListing;
