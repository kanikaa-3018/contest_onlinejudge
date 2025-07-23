import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const InternshipTable = ({ internships, toggleStatus }) => {
  // A small sub-component for the status badges to keep the table clean
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200",
      rejected: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-200",
      accepted: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-200",
    };
    return (
      <Badge
        className={`${styles[status] || "bg-muted text-muted-foreground"} border-0 uppercase text-xs`}
      >
        {status}
      </Badge>
    );
  };

  // A sub-component for the action buttons
  const ActionButton = ({ checked, onClick }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="h-8 w-8"
    >
      {checked ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );

  return (
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Role</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-center font-semibold">Applied</TableHead>
            <TableHead className="text-center font-semibold">Follow-up</TableHead>
            <TableHead className="text-center font-semibold">Interview</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {internships.length > 0 ? (
            internships.map((internship) => (
              <TableRow key={internship.id}>
                <TableCell className="font-medium text-foreground">
                  {internship.company}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {internship.role}
                </TableCell>
                <TableCell>
                  <StatusBadge status={internship.status} />
                </TableCell>
                <TableCell className="text-center">
                  <ActionButton
                    checked={internship.applied}
                    onClick={() => toggleStatus(internship.id, "applied")}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <ActionButton
                    checked={internship.followedUp}
                    onClick={() => toggleStatus(internship.id, "followedUp")}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <ActionButton
                    checked={internship.interview}
                    onClick={() => toggleStatus(internship.id, "interview")}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center h-24 text-muted-foreground"
              >
                No internships found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InternshipTable;