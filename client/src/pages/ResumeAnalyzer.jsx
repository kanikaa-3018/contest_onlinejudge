import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  FileText,
  Upload,
  Bell,
  User,
  BarChart3,
  Target,
  Briefcase,
} from 'lucide-react';

import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import FileUpload from '../components/FileUpload.jsx'; // Ensure this component exists
import AnalysisReport from '../components/AnalysisReport.jsx'; // Ensure this component exists

function ResumeAnalyzer() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const analyzeResumeMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('resume', file);

      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const next = prev + Math.random() * 15;
          return next >= 90 ? 90 : next;
        });
      }, 200);

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze-resume`, {
          method: 'POST',
          body: formData,
        });
        // console.log(response)
        clearInterval(progressInterval);
        setAnalysisProgress(100);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Analysis failed');
        }

        return response.json();
      } catch (error) {
        clearInterval(progressInterval);
        setAnalysisProgress(0);
        throw error;
      }
    },
    onSuccess: (data) => {
      setAnalysisId(data.id);
      setTimeout(() => setAnalysisProgress(0), 1000);
    },
    onError: (error) => {
      console.error('Analysis failed:', error.message);
      setAnalysisProgress(0);
    },
  });

  const analyzeSampleMutation = useMutation({
    mutationFn: async (sampleType) => {
      setAnalysisProgress(10);

      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const next = prev + Math.random() * 15;
          return next >= 90 ? 90 : next;
        });
      }, 200);

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze-sample`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sampleType }),
        });

        clearInterval(progressInterval);
        setAnalysisProgress(100);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Analysis failed');
        }

        return response.json();
      } catch (error) {
        clearInterval(progressInterval);
        setAnalysisProgress(0);
        throw error;
      }
    },
    onSuccess: (data) => {
      setAnalysisId(data.id);
      setTimeout(() => setAnalysisProgress(0), 1000);
    },
    onError: (error) => {
      console.error('Sample analysis failed:', error.message);
      setAnalysisProgress(0);
    },
  });

  const { data: analysisData, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: [`${import.meta.env.VITE_BACKEND_URL}/api/analysis`, analysisId],
    queryFn: () => fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analysis/${analysisId}`).then((res) => res.json()),
    enabled: !!analysisId,
  });

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    analyzeResumeMutation.mutate(file);
  };

  const handleSampleLoad = (sampleType) => {
    analyzeSampleMutation.mutate(sampleType);
  };

  const sampleResumes = [
    {
      id: 'software-engineer',
      name: 'Software Engineer Resume',
      description: '5 years experience',
      icon: FileText,
    },
    {
      id: 'marketing-manager',
      name: 'Marketing Manager Resume',
      description: '8 years experience',
      icon: FileText,
    },
    {
      id: 'data-scientist',
      name: 'Data Scientist Resume',
      description: '3 years experience',
      icon: FileText,
    },
  ];

  const isAnalyzing = analyzeResumeMutation.isPending || analyzeSampleMutation.isPending;

  return (
    <div className="min-h-screen bg-[#161a30]">
      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 ">
            <Card className="shadow-sm bg-[#1E1E2E]">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume</h2>
                  <p className="text-muted-foreground">Get instant AI-powered analysis and ATS scoring</p>
                </div>

                <FileUpload
                  onFileSelect={handleFileUpload}
                  disabled={isAnalyzing}
                  acceptedFileTypes={{
                    'application/pdf': ['.pdf'],
                    'application/msword': ['.doc'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                    'text/plain': ['.txt'],
                  }}
                  maxSize={10 * 1024 * 1024}
                />

                <Button
                  className="w-full mt-6"
                  disabled={!uploadedFile || isAnalyzing}
                  onClick={() => uploadedFile && handleFileUpload(uploadedFile)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Analyze Resume
                </Button>

                {isAnalyzing && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>Analyzing resume...</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sample Resumes */}
            <Card className="shadow-sm mt-6 bg-[#1E1E2E]">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Try Sample Resumes</h3>
                <div className="space-y-3">
                  {sampleResumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                      onClick={() => handleSampleLoad(resume.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{resume.name}</p>
                          <p className="text-xs text-muted-foreground">{resume.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">→</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 ">
            {analysisData && !isLoadingAnalysis ? (
              <AnalysisReport analysis={analysisData} />
            ) : (
              <Card className="shadow-sm bg-[#1E1E2E]">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground">Upload a resume or try a sample to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
