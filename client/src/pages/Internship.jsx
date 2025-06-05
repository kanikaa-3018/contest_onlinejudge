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
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "#161A30", color: "#B6BBC4" }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          backgroundColor: "#161a30",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#fff" }}>
              Internship Tracker
            </h1>
            <p style={{ color: "#5A7184" }}>
              Track and manage your internship applications in one place
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/resume")}>
            Resume Analyzer
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#1976D2", height: 16, width: 16 }}
            />
            <Input
              className="pl-10"
              placeholder="Search companies or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderColor: "#1976D2" }}
            />
          </div>
          <div className="flex gap-2">
            <Tabs
              value={view}
              onValueChange={(v) => setView(v)}
              className="sm:w-auto"
            >
              <TabsList style={{ borderColor: "#1976D2" }}>
                <TabsTrigger
                  value="table"
                  style={{ color: view === "table" ? "#1976D2" : "#5A7184" }}
                >
                  Table
                </TabsTrigger>
                <TabsTrigger
                  value="cards"
                  style={{ color: view === "cards" ? "#1976D2" : "#5A7184" }}
                >
                  Cards
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {loading && <p style={{ color: "#1976D2" }}>Loading internships...</p>}
        {error && <p style={{ color: "#D32F2F" }}>{error}</p>}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card
                className="p-4 flex flex-col"
                style={{ backgroundColor: "#31304D", color: "#fff" }}
              >
                <p className="text-sm">Total Applications</p>
                <p className="text-2xl font-bold">{internships.length}</p>
              </Card>
              <Card
                className="p-4 flex flex-col"
                style={{ backgroundColor: "#31304D", color: "#fff" }}
              >
                <p className="text-sm">Applied</p>
                <p className="text-2xl font-bold">
                  {internships.filter((i) => i.applied).length}
                </p>
              </Card>
              <Card
                className="p-4 flex flex-col"
                style={{ backgroundColor: "#31304D", color: "#fff" }}
              >
                <p className="text-sm">Follow-ups Made</p>
                <p className="text-2xl font-bold">
                  {internships.filter((i) => i.followedUp).length}
                </p>
              </Card>
              <Card
                className="p-4 flex flex-col"
                style={{ backgroundColor: "#31304D", color: "#fff" }}
              >
                <p className="text-sm">Interviews</p>
                <p className="text-2xl font-bold">
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
