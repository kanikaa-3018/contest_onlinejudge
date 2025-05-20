import { Check, X, Link, Calendar } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const InternshipCards = ({ internships, toggleStatus }) => {
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      rejected: "bg-red-100 text-red-800 hover:bg-red-200",
      accepted: "bg-green-100 text-green-800 hover:bg-green-200",
    };

    return <Badge className={styles[status]} variant="outline">{status}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {internships.length === 0 ? (
        <div className="col-span-full text-center py-12 text-slate-500">
          No internships found
        </div>
      ) : (
        internships.map((internship) => (
          <Card key={internship.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{internship.company}</h3>
                  <p className="text-sm text-slate-600">{internship.role}</p>
                </div>
                <StatusBadge status={internship.status} />
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Location:</span>
                  <span className="text-sm font-medium">{internship.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Deadline:</span>
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {internship.deadline}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-500">Notes:</span>
                  <p className="text-sm bg-slate-50 p-2 rounded-md">{internship.notes}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={internship.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
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
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 ${
                    internship.applied ? "bg-green-50 border-green-200 text-green-700" : ""
                  }`}
                  onClick={() => toggleStatus(internship.id, "applied")}
                >
                  {internship.applied ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  Applied
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 ${
                    internship.followedUp ? "bg-green-50 border-green-200 text-green-700" : ""
                  }`}
                  onClick={() => toggleStatus(internship.id, "followedUp")}
                >
                  {internship.followedUp ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  Follow-up
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-1 ${
                    internship.interview ? "bg-green-50 border-green-200 text-green-700" : ""
                  }`}
                  onClick={() => toggleStatus(internship.id, "interview")}
                >
                  {internship.interview ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
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
