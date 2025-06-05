'use client'

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

function ReferenceCodeModal({ questionId }) {
  const [language, setLanguage] = useState("cpp")
  const [code, setCode] = useState({
    cpp: "",
    python: "",
    js: "",
    java: ""
  })
  const [open, setOpen] = useState(false)

  const saveReferenceCode = async () => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/questions/${questionId}/reference-code`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cpp: code.cpp,
        python: code.python,
        java: code.java,
        javascript: code.js,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Saved:", result);
      setOpen(false) 
    } else {
      console.error("Error:", result.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 text-sm bg-transparent text-gray-400 border-[#161A30] hover:text-white hover:bg-[#3b82f6]/10"
        >
          Add Reference Code
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl" style={{ backgroundColor: "#1e1e2f", color: "#f5f5f5" }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Reference Code</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="cpp"
          className="w-full"
          onValueChange={(val) => setLanguage(val)}
        >
          <TabsList
            className="grid w-full grid-cols-4 mb-4 rounded-md"
            style={{ backgroundColor: "#2e2e3e" }}
          >
            <TabsTrigger value="cpp" className="text-[#000000]">C++</TabsTrigger>
            <TabsTrigger value="python" className="text-black">Python</TabsTrigger>
            <TabsTrigger value="java" className="text-black">Java</TabsTrigger>
            <TabsTrigger value="js" className="text-black">JavaScript</TabsTrigger>
          </TabsList>

          <TabsContent value="cpp">
            <Textarea
              rows={6}
              placeholder="Enter your C++ code here..."
              style={{ backgroundColor: "#2a2a3a", color: "#f5f5f5" }}
              value={code.cpp}
              onChange={(e) => setCode({ ...code, cpp: e.target.value })}
            />
          </TabsContent>

          <TabsContent value="python">
            <Textarea
              rows={6}
              placeholder="Enter your Python code here..."
              style={{ backgroundColor: "#2a2a3a", color: "#f5f5f5" }}
              value={code.python}
              onChange={(e) => setCode({ ...code, python: e.target.value })}
            />
          </TabsContent>

          <TabsContent value="java">
            <Textarea
              rows={6}
              placeholder="Enter your Java code here..."
              style={{ backgroundColor: "#2a2a3a", color: "#f5f5f5" }}
              value={code.java}
              onChange={(e) => setCode({ ...code, java: e.target.value })}
            />
          </TabsContent>

          <TabsContent value="js">
            <Textarea
              rows={6}
              placeholder="Enter your JavaScript code here..."
              style={{ backgroundColor: "#2a2a3a", color: "#f5f5f5" }}
              value={code.js}
              onChange={(e) => setCode({ ...code, js: e.target.value })}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white"
            onClick={() => {
              saveReferenceCode()
            //   console.log("Saved Code:", code)
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReferenceCodeModal;