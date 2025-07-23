import { Check, X, Link, Calendar } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const InternshipCards = ({ internships, toggleStatus }) => {
  // This sub-component is already well-designed for theming! No changes needed here.
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200",
      rejected: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-200",
      accepted: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-200",
    };
    return (
      <Badge
        className={`${styles[status] || "bg-muted text-muted-foreground"} font-semibold uppercase tracking-wide border-0`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {internships.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No internships found
        </div>
      ) : (
        internships.map((internship) => (
          // Use theme variables for card background and border
          <Card key={internship.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-card border-border">
            {/* Use theme variable for header background and text */}
            <CardHeader className="bg-accent/50 py-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-card-foreground">{internship.company}</h3>
                  <p className="text-sm text-muted-foreground">{internship.role}</p>
                </div>
                <StatusBadge status={internship.status} />
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="text-sm font-medium text-foreground">{internship.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deadline:</span>
                  <span className="text-sm font-medium flex items-center gap-1 text-foreground">
                    <Calendar className="h-4 w-4 text-primary" /> {/* Use primary color for icon */}
                    {internship.deadline}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">Notes:</span>
                  {/* Use muted theme colors for notes background and text */}
                  <p className="text-sm bg-muted text-muted-foreground p-2 rounded-md">{internship.notes}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-border pt-4">
              <div className="flex items-center justify-between w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Use primary color for links */}
                      <a
                        href={internship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                      >
                        <Link className="h-4 w-4" /> Visit job posting
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open job posting in new tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                {/* Refactor each button to have dark: variants */}
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 transition-colors rounded-md ${
                    internship.applied
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-800"
                      : "bg-muted border-border text-muted-foreground hover:bg-accent"
                  }`}
                  onClick={() => toggleStatus(internship.id, "applied")}
                >
                  {internship.applied ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Applied
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 transition-colors rounded-md ${
                    internship.followedUp
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-800"
                      : "bg-muted border-border text-muted-foreground hover:bg-accent"
                  }`}
                  onClick={() => toggleStatus(internship.id, "followedUp")}
                >
                  {internship.followedUp ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Follow-up
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 transition-colors rounded-md ${
                    internship.interview
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-800"
                      : "bg-muted border-border text-muted-foreground hover:bg-accent"
                  }`}
                  onClick={() => toggleStatus(internship.id, "interview")}
                >
                  {internship.interview ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  Interview
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default InternshipCards;