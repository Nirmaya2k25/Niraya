import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Calculator } from "lucide-react";

interface CalculationStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed";
}

interface CalculationProgressProps {
  isCalculating: boolean;
  onComplete: (results: any) => void;
}

const calculationSteps: CalculationStep[] = [
  {
    id: "validation",
    name: "Data Validation",
    description: "Checking data format and units",
    status: "pending"
  },
  {
    id: "hpi",
    name: "Heavy Metal Pollution Index (HPI)",
    description: "Calculating overall pollution levels",
    status: "pending"
  },
  {
    id: "hei",
    name: "Heavy Metal Evaluation Index (HEI)",
    description: "Evaluating contamination levels",
    status: "pending"
  },
  {
    id: "mpi",
    name: "Metal Pollution Index (MPI)",
    description: "Analyzing metal concentration ratios",
    status: "pending"
  },
  {
    id: "cf_cd",
    name: "Contamination Factor & Degree (CF/Cd)",
    description: "Determining contamination factors",
    status: "pending"
  },
  {
    id: "pli",
    name: "Pollution Load Index (PLI)",
    description: "Calculating pollution load",
    status: "pending"
  }
];

const CalculationProgress = ({ isCalculating, onComplete }: CalculationProgressProps) => {
  const [steps, setSteps] = useState<CalculationStep[]>(calculationSteps);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isCalculating) {
      setSteps(calculationSteps);
      setCurrentStep(0);
      return;
    }

    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Update current step to processing
        setSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: "processing" }
            : index < i 
              ? { ...step, status: "completed" }
              : step
        ));
        setCurrentStep(i);

        // Simulate calculation time
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        // Mark step as completed
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: "completed" } : step
        ));
      }

      // All steps completed - generate mock results
      const mockResults = {
        summary: {
          totalSamples: 25,
          safeLocations: 8,
          moderateLocations: 12,
          unsafeLocations: 5
        },
        indices: {
          HPI: { value: 45.2, classification: "Moderate" },
          HEI: { value: 12.8, classification: "Safe" },
          MPI: { value: 3.1, classification: "Moderate" },
          CF: { value: 2.4, classification: "Moderate" },
          PLI: { value: 1.8, classification: "Unsafe" }
        },
        locations: Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          lat: 28.6139 + (Math.random() - 0.5) * 0.1,
          lng: 77.2090 + (Math.random() - 0.5) * 0.1,
          hpi: Math.random() * 100,
          classification: ["Safe", "Moderate", "Unsafe"][Math.floor(Math.random() * 3)]
        }))
      };

      setTimeout(() => onComplete(mockResults), 500);
    };

    processSteps();
  }, [isCalculating, onComplete]);

  const completedSteps = steps.filter(step => step.status === "completed").length;
  const progress = (completedSteps / steps.length) * 100;

  if (!isCalculating) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span>Calculating Pollution Indices</span>
        </CardTitle>
        <CardDescription>
          Processing your groundwater data through advanced pollution analysis algorithms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border"
            >
              <div className="flex-shrink-0">
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-safe" />
                ) : step.status === "processing" ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground">{step.name}</p>
                  <Badge 
                    variant={
                      step.status === "completed" ? "default" : 
                      step.status === "processing" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {step.status === "completed" ? "Done" : 
                     step.status === "processing" ? "Processing" : "Waiting"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationProgress;