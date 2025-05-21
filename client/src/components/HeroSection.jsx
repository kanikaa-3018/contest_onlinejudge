import React from "react";
import { Calendar, FileCode, Github, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeTree  from "./CodeTree";
import VsCodeAnimation  from "./VsCodeAnimation";
import  FloatingCard  from "./FloatingCard";


 const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#1e1e1e] to-[#1e1e1e]/95">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-5" 
        style={{ 
          backgroundImage: "linear-gradient(#646CFF 1px, transparent 1px), linear-gradient(90deg, #646CFF 1px, transparent 1px)", 
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Background glow effects */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#1829ea]/20 rounded-full filter blur-[100px] animate-spin-slow" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#1829ea]/20 rounded-full filter blur-[100px] animate-spin-slow" style={{ animationDirection: "reverse" }} />
      
      {/* Header and navigation */}
      <header className="relative z-10 py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-8 w-8 text-vscode-accent" />
            <h1 className="text-xl font-bold">Developer Platform</h1>
          </div>
          
        </div>
      </header>
      
      {/* Main hero content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - text and CTA */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-1 w-12 bg-blue-600"></div>
                <span className="text-vscode-accent font-2xl">Welcome to CodeArena</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block">Your Journey.</span>
                <span className="block text-blue-600">
                  Your Success.
                </span>
              </h2>
              
              <p className="text-md md:text-md text-muted-foreground max-w-2xl">
                Explore internships, build your profile, and track coding contests - all in one place. 
                Your comprehensive platform for developer growth and opportunities.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#1829ea] hover:bg-[#1829ea]/80">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="group">
                <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                View on GitHub
              </Button>
            </div>
            
            {/* Floating feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <FloatingCard
                icon={<Search className="h-6 w-6" />}
                title="Internship Search"
                description="Find the perfect internship opportunities tailored to your skills and interests."
                color="#646CFF"
                animationDelay={0}
              />
              <FloatingCard
                icon={<FileCode className="h-6 w-6" />}
                title="Developer Profile"
                description="Showcase your skills, projects, and achievements to potential employers."
                color="#08979C"
                animationDelay={300}
              />
              <FloatingCard
                icon={<Calendar className="h-6 w-6" />}
                title="Contest Tracking"
                description="Never miss a coding competition with our comprehensive contest calendar."
                color="#DCDCAA"
                animationDelay={600}
              />
              <FloatingCard
                icon={<Github className="h-6 w-6" />}
                title="GitHub Integration"
                description="Connect your GitHub account to showcase your repositories and contributions."
                color="#CE9178"
                animationDelay={900}
              />
            </div>
          </div>
          
          {/* Right column - code examples */}
          <div className="relative">
            {/* VS Code-like terminals with animated code */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-vscode-accent/10 rounded-full filter blur-[40px] animate-pulse-slow"></div>
            
            {/* Code editor terminal */}
            <div className="relative z-20 shadow-2xl shadow-[#1829ea]/20">
              <VsCodeAnimation className="animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-200" />
            </div>
            
            {/* File tree terminal */}
            <div className="absolute z-10 top-8 -left-16 md:-left-24 rotate-[-6deg] shadow-xl transform-gpu">
              <CodeTree />
            </div>
            
            {/* Floating code snippet */}
            <div className="absolute bottom-8 -right-6 md:-right-12 rotate-[6deg] shadow-xl transform-gpu">
              <div className="bg-vscode-bg rounded-md border border-border p-3 max-w-xs animate-float">
                <pre className="text-sm text-[#6A9955]">
                  <code>{`function trackProgress(user) {
  const contests = user.contests;
  const rating = calculateRating(
    contests.results
  );
  return { rating, progress };
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated text highlight */}
        <div className="mt-24 text-center relative">
          <div className="inline-block relative">
            <div className="h-1 w-full bg-[#1829ea] absolute bottom-0 left-0"></div>
            <h2 className="text-2xl font-semibold mb-2">Ready to accelerate your developer journey?</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Join thousands of developers who are building their careers with our comprehensive platform.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
