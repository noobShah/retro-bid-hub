import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuctionTimer } from "@/hooks/useAuctionTimer";

interface Participation {
  id: string;
  auction_id: string;
  platform_fee: number;
  deposit_fee: number;
  status: string;
  joined_at: string;
  auctions: {
    title: string;
    city: string;
    category: string;
    base_price: number;
    expiration_date: string;
    status: string;
    images: string[];
  };
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchParticipations();
  }, [isAuthenticated, navigate]);

  const fetchParticipations = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('participations')
      .select(`
        *,
        auctions (
          title,
          city,
          category,
          base_price,
          expiration_date,
          status,
          images
        )
      `)
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('Error fetching participations:', error);
    } else {
      setParticipations(data || []);
    }
    setLoading(false);
  };

  const activeParticipations = participations.filter(p => p.status === 'active');
  const wonParticipations = participations.filter(p => p.status === 'won');
  const lostParticipations = participations.filter(p => p.status === 'lost');

  const ParticipationCard = ({ participation }: { participation: Participation }) => {
    const { timeRemaining, isExpired } = useAuctionTimer(participation.auctions.expiration_date);
    
    return (
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <img 
              src={participation.auctions.images?.[0] || 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400'} 
              alt={participation.auctions.title}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-grotesk font-semibold text-lg mb-2">
                {participation.auctions.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {participation.auctions.city}
                </Badge>
                <Badge variant="outline">{participation.auctions.category}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeRemaining}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm text-muted-foreground">Base Price</p>
                  <p className="font-bebas text-2xl tracking-wide">
                    ₹{participation.auctions.base_price.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm text-muted-foreground">Your Investment</p>
                  <p className="font-bebas text-2xl tracking-wide text-primary">
                    ₹{(participation.platform_fee + participation.deposit_fee).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg font-sans">Loading your auctions...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-courier font-bold text-4xl uppercase tracking-wider mb-2">
            My Auctions
          </h1>
          <div className="h-0.5 w-48 bg-accent" />
          <p className="font-sans text-muted-foreground mt-4">
            Track your auction participations and wins
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="font-grotesk text-sm uppercase tracking-wide text-muted-foreground">
                Active Participations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bebas text-4xl tracking-wide text-foreground">
                {activeParticipations.length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="font-grotesk text-sm uppercase tracking-wide text-muted-foreground">
                Auctions Won
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bebas text-4xl tracking-wide text-green-600">
                {wonParticipations.length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="font-grotesk text-sm uppercase tracking-wide text-muted-foreground">
                Total Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bebas text-4xl tracking-wide text-primary">
                ₹{participations.reduce((sum, p) => sum + p.platform_fee + p.deposit_fee, 0).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="active" className="font-grotesk uppercase text-sm">
              Active ({activeParticipations.length})
            </TabsTrigger>
            <TabsTrigger value="won" className="font-grotesk uppercase text-sm">
              Won ({wonParticipations.length})
            </TabsTrigger>
            <TabsTrigger value="lost" className="font-grotesk uppercase text-sm">
              Lost ({lostParticipations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeParticipations.length > 0 ? (
              activeParticipations.map(p => <ParticipationCard key={p.id} participation={p} />)
            ) : (
              <Card className="border-2">
                <CardContent className="p-12 text-center">
                  <p className="font-sans text-muted-foreground">No active participations</p>
                  <Button 
                    onClick={() => navigate('/auctions')}
                    className="mt-4 font-grotesk uppercase"
                  >
                    Browse Auctions
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="won" className="space-y-4">
            {wonParticipations.length > 0 ? (
              wonParticipations.map(p => <ParticipationCard key={p.id} participation={p} />)
            ) : (
              <Card className="border-2">
                <CardContent className="p-12 text-center">
                  <p className="font-sans text-muted-foreground">No won auctions yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="lost" className="space-y-4">
            {lostParticipations.length > 0 ? (
              lostParticipations.map(p => <ParticipationCard key={p.id} participation={p} />)
            ) : (
              <Card className="border-2">
                <CardContent className="p-12 text-center">
                  <p className="font-sans text-muted-foreground">No lost auctions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
