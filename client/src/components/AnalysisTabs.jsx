import { useState } from "react";
import { BarChart3, Briefcase, Lightbulb, Hash, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge"; // Adjust import path based on your structure
import JobMatches from "./JobMatches"; 

function AnalysisTabs({ analysis }) {
  const [activeTab, setActiveTab] = useState("analysis");

  const getStatusBadge = (status) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-accent text-accent-foreground"><CheckCircle className="w-3 h-3 mr-1" />Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500 text-white"><AlertCircle className="w-3 h-3 mr-1" />Good</Badge>;
      case 'needs_improvement':
        return <Badge className="bg-amber-500 text-white"><AlertCircle className="w-3 h-3 mr-1" />Needs Improvement</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const tabs = [
    { id: "analysis", label: "Analysis", icon: BarChart3 },
    { id: "job-matches", label: "Job Matches", icon: Briefcase },
    { id: "suggestions", label: "Suggestions", icon: Lightbulb },
    { id: "keywords", label: "Keywords", icon: Hash }
  ];

  return (
    <div className="bg-[#282841]/60 backdrop-blur-md  rounded-xl shadow-sm border border-border">
     
      <div className="grid grid-cols-4 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-4 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary bg-transparent text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2 inline" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "analysis" && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                <Badge className="bg-white text-black hover:bg-gray-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  {analysis.contactInfo.hasPhone ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span>Phone number present</span>
                </div>
                <div className="flex items-center space-x-2">
                  {analysis.contactInfo.hasEmail ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span>Professional email</span>
                </div>
                <div className="flex items-center space-x-2">
                  {analysis.contactInfo.hasLinkedIn ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span>LinkedIn profile</span>
                </div>
                <div className="flex items-center space-x-2">
                  {analysis.contactInfo.hasLocation ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span>Location specified</span>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Professional Summary</h3>
                {getStatusBadge(analysis.professionalSummary.status)}
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  {analysis.professionalSummary.present ? <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" /> : <XCircle className="w-4 h-4 text-destructive mt-0.5" />}
                  <span>Summary section present ({analysis.professionalSummary.wordCount} words)</span>
                </div>
                <div className="flex items-start space-x-2">
                  {analysis.professionalSummary.hasQuantifiableAchievements ? <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" /> : <XCircle className="w-4 h-4 text-destructive mt-0.5" />}
                  <span>Contains quantifiable achievements</span>
                </div>
                <div className="flex items-start space-x-2">
                  {analysis.professionalSummary.hasIndustryKeywords ? <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />}
                  <span>Includes industry-specific keywords</span>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
                {getStatusBadge(analysis.workExperience.status)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>{analysis.workExperience.yearsOfExperience} years of experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  {analysis.workExperience.hasProgression ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span>Clear job progression</span>
                </div>
                <div className="flex items-center space-x-2">
                  {analysis.workExperience.hasQuantifiedAchievements ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span>Quantified achievements</span>
                </div>
                <div className="flex items-center space-x-2">
                  {analysis.workExperience.isRelevant ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-destructive" />}
                  <span>Relevant to target role</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground">Skills & Technologies</h3>
                {getStatusBadge(analysis.skills.status)}
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.detectedSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-500 text-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {analysis.skills.suggestedSkills.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    <Lightbulb className="w-4 h-4 text-amber-500 inline mr-1" />
                    Consider adding: {analysis.skills.suggestedSkills.join(", ")} for better match rates
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "job-matches" && (
          <JobMatches jobMatches={analysis.jobMatches} />
        )}

        {activeTab === "suggestions" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Improvement Recommendations</h3>
              <ul className="space-y-2">
                {analysis.suggestions.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Format Recommendations</h3>
              <ul className="space-y-2">
                {analysis.suggestions.formatRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-sm text-muted-foreground">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "keywords" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Detected Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.detectedSkills.map((skill, index) => (
                  <Badge key={index} className="bg-gray-500 text-accent">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            {analysis.skills.suggestedSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Suggested Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.suggestedSkills.map((skill, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalysisTabs;
