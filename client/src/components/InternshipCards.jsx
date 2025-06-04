import { Check, X, Link, Calendar } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const InternshipCards = ({ internships, toggleStatus }) => {
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-100 text-amber-900 hover:bg-amber-200",
      rejected: "bg-red-100 text-red-900 hover:bg-red-200",
      accepted: "bg-green-100 text-green-900 hover:bg-green-200",
    };

    return (
      <Badge
        className={`${styles[status] || "bg-gray-100 text-gray-800"} font-semibold uppercase tracking-wide`}
        variant="outline"
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {internships.length === 0 ? (
        <div className="col-span-full text-center py-12 text-slate-500">
          No internships found
        </div>
      ) : (
        internships.map((internship) => (
          <Card key={internship.id} className="overflow-hidden shadow-sm border border-slate-600 hover:shadow-md transition-shadow bg-transparent">
            <CardHeader className="bg-[rgb(253,253,253,0.5)] py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">{internship.company}</h3>
                  <p className="text-sm text-slate-700">{internship.role}</p>
                </div>
                <StatusBadge status={internship.status} />
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Location:</span>
                  <span className="text-sm font-medium text-white">{internship.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Deadline:</span>
                  <span className="text-sm font-medium flex items-center gap-1 text-white">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    {internship.deadline}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-400">Notes:</span>
                  <p className="text-sm bg-slate-100 text-white p-2 rounded-md">{internship.notes}</p>
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
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
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
                  className={`flex items-center gap-1 transition-colors rounded-md ${
                    internship.applied
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                      : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200"
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
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                      : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200"
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
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-200"
                      : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200"
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
