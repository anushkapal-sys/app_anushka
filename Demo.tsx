import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Demo = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      toast({
        title: "Please enter a location",
        description: "Type in a city or place you want to explore",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestions("");

    try {
      const { data, error } = await supabase.functions.invoke("suggest-places", {
        body: { location },
      });

      if (error) {
        throw error;
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
        toast({
          title: "Suggestions ready!",
          description: "AI has generated personalized recommendations for you",
        });
      }
    } catch (error: any) {
      console.error("Error getting suggestions:", error);
      toast({
        title: "Failed to get suggestions",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Travel Assistant</h1>
            <p className="text-muted-foreground">Get personalized recommendations for any destination</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Input Section */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Where do you want to go?
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter a city or destination (e.g., Paris, Tokyo, New York)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Get Ideas
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Results Section */}
          {suggestions && (
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">AI-Powered Suggestions</h2>
                </div>
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {suggestions}
                </div>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!suggestions && !isLoading && (
            <Card className="p-12 bg-card/30 backdrop-blur-sm border-dashed border-2 border-primary/20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Start Your Journey
                  </h3>
                  <p className="text-muted-foreground">
                    Enter a destination above to get AI-powered travel recommendations
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Demo;
