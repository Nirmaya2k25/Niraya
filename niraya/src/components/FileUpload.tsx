import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
  isProcessing: boolean;
}

const FileUpload = ({ onFileUploaded, isProcessing }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError("");
    
    if (rejectedFiles.length > 0) {
      setError("Please upload a valid CSV file only.");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onFileUploaded(file);
            handleUpload(file); // Call handleUpload here
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  const resetUpload = () => {
    setUploadedFile(null);
    setError("");
    setUploadProgress(0);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:5000/process-csv', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    // Use result in your app (e.g., display in ResultsDisplay)
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Upload Groundwater Data</span>
        </CardTitle>
        <CardDescription>
          Upload your CSV file containing groundwater heavy metal concentration data with location coordinates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isDragActive ? "Drop your CSV file here" : "Drop your CSV file here, or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports CSV files up to 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {uploadProgress === 100 && (
                <CheckCircle2 className="h-5 w-5 text-safe" />
              )}
            </div>

            {uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {uploadProgress === 100 && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetUpload}
                  disabled={isProcessing}
                >
                  Upload Different File
                </Button>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Required CSV columns:</p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Location coordinates (latitude, longitude)</li>
            <li>Heavy metal concentrations (As, Cd, Cr, Cu, Fe, Mn, Ni, Pb, Zn)</li>
            <li>Sample ID and date (optional)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;