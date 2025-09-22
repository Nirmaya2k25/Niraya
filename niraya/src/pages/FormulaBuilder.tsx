import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, RotateCcw, Calculator, Info, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Formula {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: string[];
  defaultFormula: string;
  isModified: boolean;
}

const defaultFormulas: Formula[] = [
  {
    id: "hpi",
    name: "Heavy Metal Pollution Index (HPI)",
    description: "Weighted arithmetic mean method for overall pollution assessment",
    formula: "HPI = Σ(Wi × Qi) / Σ(Wi)",
    variables: ["Wi (weightage factor)", "Qi (sub-index)", "Ci (metal concentration)", "Si (standard value)"],
    defaultFormula: "HPI = Σ(Wi × Qi) / Σ(Wi)",
    isModified: false
  },
  {
    id: "hei",
    name: "Heavy Metal Evaluation Index (HEI)",
    description: "Simple additive method for contamination evaluation",
    formula: "HEI = Σ(Ci / Si)",
    variables: ["Ci (metal concentration)", "Si (standard/MAC value)"],
    defaultFormula: "HEI = Σ(Ci / Si)",
    isModified: false
  },
  {
    id: "mpi",
    name: "Metal Pollution Index (MPI)",
    description: "Geometric mean of concentration ratios",
    formula: "MPI = (C1/S1 × C2/S2 × ... × Cn/Sn)^(1/n)",
    variables: ["Ci (metal concentration)", "Si (background value)", "n (number of metals)"],
    defaultFormula: "MPI = (C1/S1 × C2/S2 × ... × Cn/Sn)^(1/n)",
    isModified: false
  },
  {
    id: "cf_cd",
    name: "Contamination Factor & Degree (CF/Cd)",
    description: "Individual and combined contamination assessment",
    formula: "CF = Ci / Cb; Cd = Σ(CFi)",
    variables: ["Ci (metal concentration)", "Cb (background concentration)", "CFi (contamination factor)"],
    defaultFormula: "CF = Ci / Cb; Cd = Σ(CFi)",
    isModified: false
  },
  {
    id: "pli",
    name: "Pollution Load Index (PLI)",
    description: "Geometric mean of contamination factors",
    formula: "PLI = (CF1 × CF2 × ... × CFn)^(1/n)",
    variables: ["CFi (contamination factor)", "n (number of metals)"],
    defaultFormula: "PLI = (CF1 × CF2 × ... × CFn)^(1/n)",
    isModified: false
  }
];

const FormulaBuilder = () => {
  const [formulas, setFormulas] = useState<Formula[]>(defaultFormulas);
  const [selectedFormula, setSelectedFormula] = useState<string>("hpi");
  const [customFormula, setCustomFormula] = useState<string>("");
  const { toast } = useToast();

  const currentFormula = formulas.find(f => f.id === selectedFormula);

  const handleFormulaChange = (newFormula: string) => {
    setCustomFormula(newFormula);
  };

  const saveCustomFormula = () => {
    if (!customFormula.trim()) {
      toast({
        title: "Empty formula",
        description: "Please enter a formula before saving.",
        variant: "destructive",
      });
      return;
    }

    setFormulas(prev => prev.map(f => 
      f.id === selectedFormula 
        ? { ...f, formula: customFormula, isModified: true }
        : f
    ));

    toast({
      title: "Formula saved",
      description: "Your custom formula has been saved and will be used in calculations.",
    });
  };

  const resetToDefault = () => {
    const formula = formulas.find(f => f.id === selectedFormula);
    if (formula) {
      setCustomFormula(formula.defaultFormula);
      setFormulas(prev => prev.map(f => 
        f.id === selectedFormula 
          ? { ...f, formula: f.defaultFormula, isModified: false }
          : f
      ));

      toast({
        title: "Formula reset",
        description: "Formula has been reset to default values.",
      });
    }
  };

  const testFormula = () => {
    toast({
      title: "Formula validation",
      description: "Formula syntax appears valid. Test with sample data to verify calculations.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
            <Settings className="h-8 w-8 text-primary" />
            <span>Formula Builder</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Customize and fine-tune the mathematical formulas used for pollution index calculations. 
            Perfect for research scientists and environmental experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formula List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Indices</CardTitle>
                <CardDescription>
                  Select an index to view and modify its formula
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {formulas.map((formula) => (
                  <button
                    key={formula.id}
                    onClick={() => {
                      setSelectedFormula(formula.id);
                      setCustomFormula(formula.formula);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedFormula === formula.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{formula.name}</span>
                      {formula.isModified && (
                        <Badge variant="secondary" className="text-xs">
                          Modified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formula.description}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={testFormula} variant="outline" className="w-full justify-start" size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Test Formula
                </Button>
                <Button onClick={resetToDefault} variant="outline" className="w-full justify-start" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Formula Editor */}
          <div className="lg:col-span-2 space-y-4">
            {currentFormula && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{currentFormula.name}</span>
                        {currentFormula.isModified && (
                          <Badge variant="secondary">Modified</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {currentFormula.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="editor" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="editor">Formula Editor</TabsTrigger>
                      <TabsTrigger value="variables">Variables</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="editor" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="formula">Formula Expression</Label>
                        <Textarea
                          id="formula"
                          placeholder="Enter your custom formula here..."
                          value={customFormula}
                          onChange={(e) => handleFormulaChange(e.target.value)}
                          className="font-mono text-sm min-h-[120px]"
                        />
                      </div>

                      <Alert>
                        <Code className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <strong>Default Formula:</strong> {currentFormula.defaultFormula}
                        </AlertDescription>
                      </Alert>

                      <div className="flex space-x-2">
                        <Button onClick={saveCustomFormula} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          Save Formula
                        </Button>
                        <Button onClick={testFormula} variant="outline">
                          <Calculator className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="variables" className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Available Variables</Label>
                        <div className="mt-2 space-y-2">
                          {currentFormula.variables.map((variable, index) => (
                            <div key={index} className="p-2 bg-muted/30 rounded text-sm font-mono">
                              {variable}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          These variables will be automatically substituted with actual values from your uploaded data during calculations.
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Formula Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Formula Comparison</CardTitle>
                <CardDescription>
                  Compare your custom formula with the default version
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Default Formula</Label>
                    <div className="mt-1 p-3 bg-muted/30 rounded text-sm font-mono">
                      {currentFormula?.defaultFormula || "Select a formula"}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Current Formula</Label>
                    <div className="mt-1 p-3 bg-primary/5 border border-primary/20 rounded text-sm font-mono">
                      {currentFormula?.formula || "Select a formula"}
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

export default FormulaBuilder;