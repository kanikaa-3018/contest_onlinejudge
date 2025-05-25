import { Download, CheckCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import CircularProgress from './CircularProgress';
import AnalysisTabs from './AnalysisTabs';

function AnalysisReport({ analysis }) {
  const getScoreLabel = (score) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-gray-100' };
    if (score >= 70) return { label: 'Good', color: 'text-amber-200' };
    return { label: 'Needs Work', color: 'text-destructive' };
  };

  const atsLabel = getScoreLabel(analysis.atsScore);
  const keywordLabel = getScoreLabel(analysis.keywordScore);
  const formatLabel = getScoreLabel(analysis.formatScore);

  const handleDownloadReport = () => {
    const reportContent = `
RESUME ANALYSIS REPORT
=====================

File: ${analysis.fileName}
Analysis Date: ${new Date(analysis.createdAt).toLocaleDateString()}

SCORES
------
ATS Score: ${analysis.atsScore}/100 (${atsLabel.label})
Keyword Match: ${analysis.keywordScore}/100 (${keywordLabel.label})
Format Score: ${analysis.formatScore}/100 (${formatLabel.label})

OVERALL ASSESSMENT
------------------
${analysis.overallAssessment}

CONTACT INFORMATION
-------------------
Phone: ${analysis.contactInfo.hasPhone ? '✓' : '✗'} Present
Email: ${analysis.contactInfo.hasEmail ? '✓' : '✗'} Present
LinkedIn: ${analysis.contactInfo.hasLinkedIn ? '✓' : '✗'} Present
Location: ${analysis.contactInfo.hasLocation ? '✓' : '✗'} Present

PROFESSIONAL SUMMARY
--------------------
Status: ${analysis.professionalSummary.status}
Word Count: ${analysis.professionalSummary.wordCount}
Has Quantifiable Achievements: ${analysis.professionalSummary.hasQuantifiableAchievements ? 'Yes' : 'No'}
Has Industry Keywords: ${analysis.professionalSummary.hasIndustryKeywords ? 'Yes' : 'No'}

WORK EXPERIENCE
---------------
Years of Experience: ${analysis.workExperience.yearsOfExperience}
Status: ${analysis.workExperience.status}
Has Career Progression: ${analysis.workExperience.hasProgression ? 'Yes' : 'No'}
Has Quantified Achievements: ${analysis.workExperience.hasQuantifiedAchievements ? 'Yes' : 'No'}
Relevant to Target Role: ${analysis.workExperience.isRelevant ? 'Yes' : 'No'}

SKILLS
------
Status: ${analysis.skills.status}
Detected Skills: ${analysis.skills.detectedSkills.join(', ')}
Suggested Skills: ${analysis.skills.suggestedSkills.join(', ')}

IMPROVEMENT SUGGESTIONS
-----------------------
${analysis.suggestions.improvements.map(item => `• ${item}`).join('\n')}

KEYWORD OPTIMIZATION
--------------------
${analysis.suggestions.keywordOptimization.map(item => `• ${item}`).join('\n')}

FORMAT RECOMMENDATIONS
----------------------
${analysis.suggestions.formatRecommendations.map(item => `• ${item}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${analysis.fileName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 ">
      {/* Score Overview Card */}
      <Card className="shadow-sm bg-[#282841]/60 backdrop-blur-md ">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">ATS Compatibility Score</h2>
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-1" />
              Download Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* ATS Score */}
            <div className="text-center">
              <CircularProgress value={analysis.atsScore} className="mx-auto mb-3" />
              <p className={`text-lg font-bold ${atsLabel.color}`}>{atsLabel.label}</p>
              <p className="text-sm text-muted-foreground">ATS Score</p>
            </div>

            {/* Keyword Score */}
            <div className="text-center">
              <CircularProgress value={analysis.keywordScore} className="mx-auto mb-3" />
              <p className={`text-lg font-bold ${keywordLabel.color}`}>{keywordLabel.label}</p>
              <p className="text-sm text-muted-foreground">Keyword Match</p>
            </div>

            {/* Format Score */}
            <div className="text-center">
              <CircularProgress value={analysis.formatScore} className="mx-auto mb-3" />
              <p className={`text-lg font-bold ${formatLabel.color}`}>{formatLabel.label}</p>
              <p className="text-sm text-muted-foreground">Format Score</p>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className=" p-4 border-t-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="text-accent-foreground text-xs" />
              </div>
              <div>
                <p className="font-medium text-gray-200">Overall Assessment</p>
                <p className="text-sm text-gray-400 mt-1">
                  {analysis.overallAssessment}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Detailed Breakdown */}
      <AnalysisTabs analysis={analysis} />
    </div>
  );
}

export default AnalysisReport;
