import React from "react";
import { Calendar, FileCode, Github, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeTree from "./CodeTree";
import VsCodeAnimation from "./VsCodeAnimation";
import FloatingCard from "./FloatingCard";
import VSCodeTypewriter from "./VSCodeTypewriter";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#1e1e1e] to-[#1e1e1e]/95">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#646CFF 1px, transparent 1px), linear-gradient(90deg, #646CFF 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Blur glows */}
      <div className="hidden sm:block absolute -top-20 -left-20 w-96 h-96 bg-[#1829ea]/20 rounded-full filter blur-[100px] animate-spin-slow" />
      <div
        className="hidden sm:block absolute -bottom-20 -right-20 w-96 h-96 bg-[#1829ea]/20 rounded-full filter blur-[100px] animate-spin-slow"
        style={{ animationDirection: "reverse" }}
      />

      {/* Header */}
      <header className="relative z-10 py-4 px-4 sm:px-6 lg:px-8 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="h-8 w-8 text-vscode-accent" />
            <h1 className="text-xl font-bold">Developer Platform</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div className="flex flex-col space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8">
            {/* Header & Description */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <div className="h-1 w-10 sm:w-12 bg-blue-600" />
                <span className="text-blue-500 text-lg sm:text-xl font-medium">
                  Welcome to CodeArena
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                <span>Your Journey.</span>
                <span className="block text-blue-600">Your Success.</span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto sm:mx-0">
                Explore internships, build your profile, and track coding
                contests - all in one place. Your comprehensive platform for
                developer growth and opportunities.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <Button
                size="lg"
                className="bg-[#1829ea] hover:bg-[#1829ea]/80 w-full sm:w-auto text-white"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group w-full sm:w-auto border-[#31304D] text-[#B6BBC4]"
              >
                <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                View on GitHub
              </Button>
            </div>

            {/* Floating Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 sm:mt-6">
              <FloatingCard
                icon={<Search className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="Internship Search"
                description="Find internship opportunities tailored to your skills and interests."
                color="#646CFF"
                animationDelay={0}
              />
              <FloatingCard
                icon={<FileCode className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="Developer Profile"
                description="Showcase your skills, projects, and achievements to employers."
                color="#08979C"
                animationDelay={300}
              />
              <FloatingCard
                icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="Contest Tracking"
                description="Never miss a competition with our contest calendar."
                color="#DCDCAA"
                animationDelay={600}
              />
              <FloatingCard
                icon={<Github className="h-5 w-5 sm:h-6 sm:w-6" />}
                title="GitHub Integration"
                description="Showcase your repositories and contributions."
                color="#CE9178"
                animationDelay={900}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="relative w-full">
            <div className="block lg:hidden mt-10">
              <VSCodeTypewriter />
            </div>

            {/* Desktop view: show animated version */}
            <div className="hidden lg:block relative z-20 shadow-2xl shadow-[#1829ea]/20">
              <VsCodeAnimation className="animate-in fade-in-50 slide-in-from-bottom-10 duration-1000 delay-200" />

              <div className="absolute z-10 top-8 -left-16 rotate-[-6deg] hidden md:block">
                <CodeTree />
              </div>
              <div className="absolute bottom-8 -right-12 rotate-[6deg] hidden md:block">
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
        </div>

        {/* Call to action */}
        <div className="mt-16 sm:mt-24 text-center relative">
          <div className="inline-block relative">
            <div className="h-1 w-full bg-[#1829ea] absolute bottom-0 left-0"></div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Ready to accelerate your developer journey?
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-sm sm:text-base">
            Join thousands of developers who are building their careers with our
            comprehensive platform.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
