import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

const CreateRoomDialog = () => {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "javascript",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, language: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || "Failed to create room";
        throw new Error(message);
      }

      const createdRoom = await response.json();

      // toast.success('Room created successfully!');
      setOpen(false);
      setFormData({ name: "", description: "", language: "javascript" });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Create room error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-[#4c4fb0] text-white">
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#161a30] text-white border border-[#2c2f4a]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">
              Create a new coding room
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Set up a collaborative space for your coding session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-300">
                Room Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Awesome Project"
                required
                className="bg-[#1f233a] text-white border border-[#2c2f4a] placeholder:text-gray-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What are you working on?"
                required
                className="bg-[#1f233a] text-white border border-[#2c2f4a] placeholder:text-gray-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="language" className="text-gray-300">
                Programming Language
              </Label>
              <Select
                value={formData.language}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger
                  id="language"
                  className="bg-[#1f233a] text-white border border-[#2c2f4a]"
                >
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f233a] text-white border border-[#2c2f4a]">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-[#4c4fb0] text-white"
            >
              Create Room
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomDialog;
