import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Calendar, 
  MapPin, 
  BarChart3, 
  FileImage,
  Settings,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  estimated_pages: number;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "comprehensive",
    name: "Comprehensive Analysis Report",
    description: "Complete report with all indices, maps, and detailed analysis",
    sections: ["Executive Summary", "Data Overview", "Pollution Indices", "Spatial Analysis", "Risk Assessment", "Recommendations"],
    estimated_pages: 15
  },
  {
    id: "summary",
    name: "Executive Summary Report",
    description: "Concise report focusing on key findings and recommendations",
    sections: ["Executive Summary", "Key Findings", "Risk Classification", "Recommendations"],
    estimated_pages: 5
  },
  {
    id: "technical",
    name: "Technical Analysis Report",
    description: "Detailed technical report for scientific and research purposes",
    sections: ["Methodology", "Data Analysis", "Statistical Results", "Pollution Indices", "Technical Appendix"],
    estimated_pages: 20
  }
];

const Reports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("comprehensive");
  const [reportTitle, setReportTitle] = useState<string>("Groundwater Heavy Metal Analysis Report");
  const [reportDescription, setReportDescription] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  const currentTemplate = reportTemplates.find(t => t.id === selectedTemplate);

  const generateReport = async () => {
    if (!reportTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a report title before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report generated successfully",
        description: "Your PDF report has been generated and is ready for download.",
      });
      
      // Simulate PDF download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${reportTitle.replace(/\s+/g, '_').toLowerCase()}.pdf`;
      link.click();
    }, 3000);

    toast({
      title: "Generating report",
      description: "Please wait while we compile your analysis into a comprehensive PDF report.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span>Report Generator</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate professional PDF reports with comprehensive analysis, charts, and recommendations 
            based on your groundwater pollution data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Templates</CardTitle>
                <CardDescription>
                  Choose a template that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {template.estimated_pages} pages
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span>Interactive Charts & Graphs</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Geospatial Visualizations</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FileImage className="h-4 w-4 text-primary" />
                  <span>High-Resolution Images</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Professional Formatting</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Report Configuration</span>
                  {currentTemplate && (
                    <Badge variant="secondary">{currentTemplate.name}</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Customize your report details and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title *</Label>
                    <Input
                      id="title"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder="Enter report title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author Name</Label>
                    <Input
                      id="author"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Enter author name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Report Description</Label>
                  <Textarea
                    id="description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Brief description of the analysis and objectives..."
                    rows={3}
                  />
                </div>

                <Separator />

                {/* Template Preview */}
                {currentTemplate && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Report Sections</Label>
                      <div className="mt-2 space-y-2">
                        {currentTemplate.sections.map((section, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>{section}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        This template will generate approximately {currentTemplate.estimated_pages} pages 
                        including charts, maps, and detailed analysis based on your uploaded data.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={generateReport} 
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate PDF Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Preview</CardTitle>
                <CardDescription>
                  Preview of how your report will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-lg p-6 bg-card/50">
                  {/* Report Header */}
                  <div className="text-center space-y-2 pb-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">{reportTitle}</h2>
                    {authorName && (
                      <p className="text-sm text-muted-foreground">By {authorName}</p>
                    )}
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date().toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span>NIRMAYA Analysis Platform</span>
                    </div>
                  </div>

                  {/* Sample Content */}
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-2">Executive Summary</h3>
                      <div className="space-y-1">
                        <div className="h-2 bg-muted rounded w-full"></div>
                        <div className="h-2 bg-muted rounded w-4/5"></div>
                        <div className="h-2 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-2">Pollution Index Results</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-8 bg-safe/20 rounded flex items-center justify-center text-xs">Chart Placeholder</div>
                        <div className="h-8 bg-moderate/20 rounded flex items-center justify-center text-xs">Map Placeholder</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;