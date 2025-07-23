import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InternshipTable from "../pages/InternshipTable.jsx";
import InternshipCards from "../components/InternshipCards.jsx";
import { useNavigate } from "react-router-dom";

const Internship = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // No changes needed in logic
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/internships`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch internships");
        }
        return res.json();
      })
      .then((data) => {
        setInternships(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredInternships = internships.filter(
    (internship) =>
      internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id, field) => {
    setInternships((prevInternships) =>
      prevInternships.map((internship) =>
        internship.id === id
          ? { ...internship, [field]: !internship[field] }
          : internship
      )
    );
  };

  return (
    // CORRECTED: Removed all hardcoded styles. The page now inherits its background.
    <div className="p-2 sm:p-6">
      <div className="max-w-7xl mx-auto rounded-lg p-4 sm:p-6 bg-card">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            {/* CORRECTED: Use theme-aware text colors */}
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Internship Tracker
            </h1>
            <p className="text-muted-foreground">
              Track and manage your internship applications in one place
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/resume")}
            className="mt-4 sm:mt-0"
          >
            Resume Analyzer
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {/* CORRECTED: Input now uses theme colors */}
            <Input
              className="pl-10"
              placeholder="Search companies or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {/* CORRECTED: Tabs now use theme colors */}
            <Tabs
              value={view}
              onValueChange={(v) => setView(v)}
              className="sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {loading && <p className="text-primary">Loading internships...</p>}
        {error && <p className="text-destructive">{error}</p>}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* CORRECTED: Summary cards now use theme variables */}
              <Card className="p-4 flex flex-col bg-background">
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{internships.length}</p>
              </Card>
              <Card className="p-4 flex flex-col bg-background">
                <p className="text-sm text-muted-foreground">Applied</p>
                <p className="text-2xl font-bold text-foreground">
                  {internships.filter((i) => i.applied).length}
                </p>
              </Card>
              <Card className="p-4 flex flex-col bg-background">
                <p className="text-sm text-muted-foreground">Follow-ups Made</p>
                <p className="text-2xl font-bold text-foreground">
                  {internships.filter((i) => i.followedUp).length}
                </p>
              </Card>
              <Card className="p-4 flex flex-col bg-background">
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold text-foreground">
                  {internships.filter((i) => i.interview).length}
                </p>
              </Card>
            </div>

            {/* Internship List */}
            <div className="mb-8">
              <Tabs value={view} className="w-full">
                <TabsContent value="table" className="mt-0">
                  <InternshipTable
                    internships={filteredInternships}
                    toggleStatus={toggleStatus}
                  />
                </TabsContent>
                <TabsContent value="cards" className="mt-0">
                  <InternshipCards
                    internships={filteredInternships}
                    toggleStatus={toggleStatus}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Internship;