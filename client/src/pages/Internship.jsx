import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InternshipTable from "../pages/InternshipTable.jsx";
import InternshipCards from "../components/InternshipCards.jsx";
// import AddInternshipDialog from "@/components/AddInternshipDialog";

const Internship = () => {
  const [view, setView] = useState("table"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/internships")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch internships");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data)
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

//   // Function to add new internship (e.g. from dialog)
//   const addInternship = (newInternship) => {
//     setInternships([...internships, { id: Date.now(), ...newInternship }]);
//   };

//   // Toggle status fields like applied, followedUp, interview
const toggleStatus = (id, field) => {
    setInternships((prevInternships) =>
      prevInternships.map((internship) => {
        if (internship.id !== id) return internship;
  
        return {
          ...internship,
          [field]: !internship[field],
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Internship Tracker</h1>
          <p className="text-slate-500">Track and manage your internship applications in one place</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search companies or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Tabs value={view} onValueChange={(v) => setView(v)} className="sm:w-auto">
              <TabsList>
                <TabsTrigger value="table">Table</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
            </Tabs>
            {/* <AddInternshipDialog addInternship={addInternship} /> */}
          </div>
        </div>

        {/* Loading and error states */}
        {loading && <p>Loading internships...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 flex flex-col">
                <p className="text-sm text-slate-500">Total Applications</p>
                <p className="text-2xl font-bold">{internships.length}</p>
              </Card>
              <Card className="p-4 flex flex-col">
                <p className="text-sm text-slate-500">Applied</p>
                <p className="text-2xl font-bold">{internships.filter((i) => i.applied).length}</p>
              </Card>
              <Card className="p-4 flex flex-col">
                <p className="text-sm text-slate-500">Follow-ups Made</p>
                <p className="text-2xl font-bold">{internships.filter((i) => i.followedUp).length}</p>
              </Card>
              <Card className="p-4 flex flex-col">
                <p className="text-sm text-slate-500">Interviews</p>
                <p className="text-2xl font-bold">{internships.filter((i) => i.interview).length}</p>
              </Card>
            </div>

            {/* Internship List */}
            <div className="mb-8">
              <Tabs value={view} className="w-full">
                <TabsContent value="table" className="mt-0">
                  <InternshipTable internships={filteredInternships} toggleStatus={toggleStatus} />
                </TabsContent>
                <TabsContent value="cards" className="mt-0">
                  <InternshipCards internships={filteredInternships} toggleStatus={toggleStatus} />
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
