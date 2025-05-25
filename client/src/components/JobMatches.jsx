import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react'; 
import { Badge } from './ui/badge'; 
import { Button } from './ui/button'; 

function JobMatches({ jobMatches }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recommended Job Matches</h3>
        <span className="text-sm text-muted-foreground">
          Based on your skills and experience
        </span>
      </div>

      {jobMatches.map((job, index) => (
        <div
          key={index}
          className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-lg font-medium text-foreground">{job.title}</h4>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-lg font-bold text-accent">{job.matchScore}</span>
                <span className="text-sm text-muted-foreground">% match</span>
              </div>
              <span className="text-sm text-muted-foreground">{job.salary}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {job.remote && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                Remote
              </Badge>
            )}
            {job.fullTime && (
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                Full-time
              </Badge>
            )}
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
              {job.experienceLevel}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {job.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {job.location}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Posted {job.postedDays} days ago
              </span>
            </div>
            <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
              View Details
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobMatches;
