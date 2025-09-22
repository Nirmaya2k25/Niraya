import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Map, MapPin, Layers, Filter, Download, Info } from "lucide-react";

const MapView = () => {
  // Mock data for demonstration
  const mockLocations = [
    { id: 1, name: "Site A", lat: 28.6139, lng: 77.2090, status: "Safe", hpi: 23.4 },
    { id: 2, name: "Site B", lat: 28.6289, lng: 77.2190, status: "Moderate", hpi: 67.8 },
    { id: 3, name: "Site C", lat: 28.6089, lng: 77.1990, status: "Unsafe", hpi: 89.2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <Map className="h-8 w-8 text-primary" />
              <span>Interactive Map View</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Visualize groundwater pollution data across sampling locations
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Map
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Map className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Interactive Map</h3>
                      <p className="text-sm text-muted-foreground">
                        Map integration will be implemented here
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Will show colored markers based on pollution levels
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-safe rounded-full"></div>
                  <span className="text-sm">Safe (HPI &lt; 50)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-moderate rounded-full"></div>
                  <span className="text-sm">Moderate (50-75)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-unsafe rounded-full"></div>
                  <span className="text-sm">Unsafe (&gt; 75)</span>
                </div>
              </CardContent>
            </Card>

            {/* Sample Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sampling Locations</CardTitle>
                <CardDescription>
                  Click on any location to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockLocations.map((location) => (
                  <div
                    key={location.id}
                    className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{location.name}</span>
                      </div>
                      <Badge 
                        className={`text-xs ${
                          location.status === "Safe" ? "bg-safe text-safe-foreground" :
                          location.status === "Moderate" ? "bg-moderate text-moderate-foreground" :
                          "bg-unsafe text-unsafe-foreground"
                        }`}
                      >
                        {location.status}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      HPI: {location.hpi}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Map Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Map Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Upload and analyze data in the Dashboard to see your results plotted on this interactive map.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;