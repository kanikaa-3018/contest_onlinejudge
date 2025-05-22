import { useState } from "react";
import { Check, X, Link, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const InternshipTable = ({ internships, toggleStatus }) => {
  const [sortField, setSortField] = useState("company");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedInternships = [...internships].sort((a, b) => {
    if (typeof a[sortField] === "string" && typeof b[sortField] === "string") {
      return sortDirection === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }

    if (typeof a[sortField] === "boolean" && typeof b[sortField] === "boolean") {
      return sortDirection === "asc"
        ? Number(a[sortField]) - Number(b[sortField])
        : Number(b[sortField]) - Number(a[sortField]);
    }

    return 0;
  });

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      rejected: "bg-red-100 text-red-600 hover:bg-red-200",
      accepted: "bg-green-100 text-green-700 hover:bg-green-200",
    };

    return (
      <Badge className={styles[status]} variant="outline">
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border  overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead
                onClick={() => handleSort("company")}
                className="cursor-pointer w-[180px] text-slate-700"
              >
                Company {sortField === "company" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("role")} className="cursor-pointer text-slate-700">
                Role
              </TableHead>
              <TableHead className="w-[120px] text-slate-700">Location</TableHead>
              <TableHead className="w-[100px] text-slate-700">Link</TableHead>
              <TableHead className="w-[100px] text-slate-700">Applied</TableHead>
              <TableHead className="w-[100px] text-slate-700">Follow-up</TableHead>
              <TableHead className="w-[100px] text-slate-700">Interview</TableHead>
              <TableHead className="w-[120px] text-slate-700">Deadline</TableHead>
              <TableHead className="w-[100px] text-slate-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInternships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                  No internships found
                </TableCell>
              </TableRow>
            ) : (
              sortedInternships.map((internship) => (
                <TableRow key={internship.id} className="hover:bg-slate-800">
                  <TableCell className="font-medium text-white">{internship.title}</TableCell>
                  <TableCell className=" text-slate-200">{internship.company}</TableCell>
                  <TableCell className=" text-slate-200">{internship.location}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={internship.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                          >
                            <Link className="h-4 w-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visit job posting</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${
                        internship.applied
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                      onClick={() => toggleStatus(internship.id, "applied")}
                    >
                      {internship.applied ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${
                        internship.followedUp
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                      onClick={() => toggleStatus(internship.id, "followedUp")}
                    >
                      {internship.followedUp ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${
                        internship.interview
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                      onClick={() => toggleStatus(internship.id, "interview")}
                    >
                      {internship.interview ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-slate-200">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{internship.deadline}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={internship.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InternshipTable;
