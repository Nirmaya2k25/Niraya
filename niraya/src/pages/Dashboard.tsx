import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FileUpload from "@/components/FileUpload";
import CalculationProgress from "@/components/CalculationProgress";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Calculator, FileUp, Info } from "lucide-react";

interface CalculationResults {
  summary: {
    totalSamples: number;
    safeLocations: number;
    moderateLocations: number;
    unsafeLocations: number;
  };
  indices: {
    [key: string]: {
      value: number;
      classification: "Safe" | "Moderate" | "Unsafe";
    };
  };
  locations: Array<{
    id: number;
    lat: number;
    lng: number;
    hpi: number;
    classification: "Safe" | "Moderate" | "Unsafe";
  }>;
}

type DashboardState = "upload" | "calculating" | "results";

const Dashboard = () => {
  const [state, setState] = useState<DashboardState>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const { toast } = useToast();

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} is ready for processing.`,
    });
  };

  const handleStartCalculation = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a CSV file before starting calculations.",
        variant: "destructive",
      });
      return;
    }

    setState("calculating");
    toast({
      title: "Calculation started",
      description: "Processing your groundwater data through pollution analysis algorithms.",
    });

    // Send file to backend API
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("http://localhost:5000/process-csv", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to process file");
      const result = await response.json();

      // Adapt result to your ResultsDisplay format if needed
      setResults(result);
      setState("results");
      toast({
        title: "Analysis complete",
        description: "Heavy metal pollution indices have been calculated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process file.",
        variant: "destructive",
      });
      setState("upload");
    }
  };

  const handleCalculationComplete = (calculationResults: CalculationResults) => {
    setResults(calculationResults);
    setState("results");
    toast({
      title: "Analysis complete",
      description: "Heavy metal pollution indices have been calculated successfully.",
    });
  };

  const handleDownloadResults = () => {
    if (!results) return;
    
    // Create CSV content
    const csvContent = [
      ["Index", "Value", "Classification"],
      ...Object.entries(results.indices).map(([key, data]) => [
        key,
        data.value.toFixed(2),
        data.classification
      ])
    ].map(row => row.join(",")).join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nirmaya_pollution_indices_results.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Results downloaded",
      description: "CSV file with pollution indices has been saved.",
    });
  };

  const handleViewMap = () => {
    // Navigate to map view (will implement routing)
    toast({
      title: "Map view",
      description: "Interactive map feature coming soon!",
    });
  };

  const resetDashboard = () => {
    setState("upload");
    setUploadedFile(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Heavy Metal Pollution Analysis
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload your groundwater data and get comprehensive pollution indices analysis 
            with interactive visualizations and detailed reports.
          </p>
        </div>

        {/* Process Steps Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-border">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              state === "upload" ? "bg-primary text-primary-foreground" : 
              "bg-safe text-safe-foreground"
            }`}>
              <FileUp className="h-4 w-4" />
              <span>Upload Data</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              state === "calculating" ? "bg-primary text-primary-foreground" : 
              state === "results" ? "bg-safe text-safe-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Calculator className="h-4 w-4" />
              <span>Calculate</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              state === "results" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Info className="h-4 w-4" />
              <span>Results</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {state === "upload" && (
            <div className="space-y-6">
              <FileUpload 
                onFileUploaded={handleFileUploaded} 
                isProcessing={false}
              />
              
              {uploadedFile && (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleStartCalculation}
                    size="lg"
                    className="px-8"
                    disabled={state !== "upload"}
                  >
                    <Calculator className="h-5 w-5 mr-2" />
                    Start Pollution Analysis
                  </Button>
                </div>
              )}

              {/* Information Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supported Indices</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="font-medium">• Heavy Metal Pollution Index (HPI)</div>
                      <div className="font-medium">• Heavy Metal Evaluation Index (HEI)</div>
                      <div className="font-medium">• Metal Pollution Index (MPI)</div>
                      <div className="font-medium">• Contamination Factor (CF) & Degree (Cd)</div>
                      <div className="font-medium">• Pollution Load Index (PLI)</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Ensure your CSV contains location coordinates and heavy metal 
                        concentrations (As, Cd, Cr, Cu, Fe, Mn, Ni, Pb, Zn) in mg/L units.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {state === "calculating" && (
            <CalculationProgress 
              isCalculating={true}
              onComplete={handleCalculationComplete}
            />
          )}

          {state === "results" && results && (
            <div className="space-y-6">
              <ResultsDisplay 
                results={results}
                onDownload={handleDownloadResults}
                onViewMap={handleViewMap}
              />
              
              <div className="flex justify-center">
                <Button 
                  onClick={resetDashboard}
                  variant="outline"
                  size="lg"
                >
                  Analyze New Dataset
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;