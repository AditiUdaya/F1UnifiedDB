import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = "http://localhost:5000";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${API_URL}/drivers`);
      const data = await response.json();
      setDrivers(data);
    } catch (err) {
      setError("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setSelectedDriver({ FName: "", LName: "", TeamID: "", Nationality: "", DOB: "", Age: "" });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${API_URL}/drivers/${selectedDriver.DriverID}`
        : `${API_URL}/drivers`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedDriver),
      });

      if (!res.ok) throw new Error("Request failed");
      await fetchDrivers();
      setOpenDialog(false);
    } catch (err) {
      console.error("❌ Error saving driver:", err);
      alert("Failed to save driver");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await fetch(`${API_URL}/drivers/${id}`, { method: "DELETE" });
      await fetchDrivers();
    } catch (err) {
      console.error("❌ Error deleting driver:", err);
      alert("Failed to delete driver");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-orbitron text-4xl font-bold text-foreground">
            DRIVERS <span className="text-gradient-racing">MANAGEMENT</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage driver records and team assignments: demonstrating CRUD operations
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="gap-2 bg-gradient-racing font-medium racing-glow-sm hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Driver
        </Button>
      </motion.div>

      {/* TABLE */}
      <Card className="border-border bg-card-elevated">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="p-4 text-center text-destructive">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Team ID</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>DOB</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((d) => (
                  <TableRow key={d.DriverID}>
                    <TableCell>{d.DriverID}</TableCell>
                    <TableCell>{d.FName} {d.LName}</TableCell>
                    <TableCell>{d.TeamID}</TableCell>
                    <TableCell>{d.Nationality}</TableCell>
                    <TableCell>{formatDate(d.DOB)}</TableCell>
                    <TableCell>{d.Age}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => alert(JSON.stringify(d, null, 2))}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(d)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(d.DriverID)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Driver" : "Add Driver"}</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-3">
              <Input name="FName" placeholder="First Name" value={selectedDriver.FName} onChange={handleInputChange} />
              <Input name="LName" placeholder="Last Name" value={selectedDriver.LName} onChange={handleInputChange} />
              <Input name="TeamID" placeholder="Team ID" value={selectedDriver.TeamID} onChange={handleInputChange} />
              <Input name="Nationality" placeholder="Nationality" value={selectedDriver.Nationality} onChange={handleInputChange} />
              <Input type="date" name="DOB" placeholder="DOB" value={selectedDriver.DOB?.split("T")[0] || ""} onChange={handleInputChange} />
              <Input name="Age" placeholder="Age" value={selectedDriver.Age} onChange={handleInputChange} />
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleSave} className="bg-gradient-racing text-white">
              {isEditing ? "Save Changes" : "Add Driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Drivers;
