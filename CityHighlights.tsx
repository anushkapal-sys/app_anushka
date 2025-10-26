import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp } from "lucide-react";
import citiesBg from "@/assets/cities-bg.jpg";

const cities = [
  {
    name: "Tokyo",
    country: "Japan",
    description: "Experience the perfect blend of tradition and cutting-edge technology",
    stats: { tourists: "15M+", rating: "4.9", spots: "200+" },
    color: "from-blue-500 to-purple-500"
  },
  {
    name: "Singapore",
    country: "Singapore",
    description: "Explore Asia's most connected and innovative smart city hub",
    stats: { tourists: "19M+", rating: "4.8", spots: "150+" },
    color: "from-cyan-500 to-blue-500"
  },
  {
    name: "Dubai",
    country: "UAE",
    description: "Discover futuristic architecture and luxury meets innovation",
    stats: { tourists: "16M+", rating: "4.9", spots: "180+" },
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Barcelona",
    country: "Spain",
    description: "Navigate through centuries of culture with modern smart infrastructure",
    stats: { tourists: "12M+", rating: "4.7", spots: "220+" },
    color: "from-orange-500 to-red-500"
  }
];

const CityHighlights = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={citiesBg} 
          alt="Global city connections" 
          className="w-[120%] h-full object-cover animate-slide-left"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/60 to-background/70" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Popular Smart Cities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the world's most technologically advanced destinations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cities.map((city, index) => (
            <Card 
              key={index}
              className="group overflow-hidden hover:shadow-[var(--shadow-medium)] transition-all duration-300 hover:-translate-y-1 border-border animate-fade-in backdrop-blur-sm"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${city.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{city.name}</h3>
                  <p className="text-sm text-muted-foreground">{city.country}</p>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {city.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center space-y-1">
                    <Users className="w-4 h-4 mx-auto text-primary" />
                    <div className="text-sm font-semibold text-foreground">{city.stats.tourists}</div>
                    <div className="text-xs text-muted-foreground">Visitors</div>
                  </div>
                  <div className="text-center space-y-1">
                    <TrendingUp className="w-4 h-4 mx-auto text-accent" />
                    <div className="text-sm font-semibold text-foreground">{city.stats.rating}</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center space-y-1">
                    <MapPin className="w-4 h-4 mx-auto text-secondary" />
                    <div className="text-sm font-semibold text-foreground">{city.stats.spots}</div>
                    <div className="text-xs text-muted-foreground">Spots</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityHighlights;
