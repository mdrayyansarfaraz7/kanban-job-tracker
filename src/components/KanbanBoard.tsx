"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "./JobCard";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

export default function KanbanBoard() {

  interface Job {
    _id: string;
    companyName: string;
    role: string;
    status: "Applied" | "Interviewing" | "Offer Received" | "Rejected";
    dateApplied?: Date;
    jobApplicationLink?: string;
    notes?: string;
    meetingLinks?: string[];
    interviewRounds?: {
      roundName: string;
      date?: Date;
      feedback?: string;
    }[];
    offerDeadline?: Date;
    priority?: "Low" | "Medium" | "High";
    location?: string;
    lastStatusChange?: Date;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;

  }

  const columns = ["Applied", "Interviewing", "Offer Received", "Rejected"] as const;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    companyName: "",
    role: "",
    jobApplicationLink: "",
    dateApplied: "",
    priority: "Medium",
    location: "",
    notes: "",
  });
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await axios.post("/api/jobs", { ...form, status: "Applied" }).then(() => {
        toast.success("Job Card Added!", {
          description: "Your job has been added to the Applied column.",
          duration: 3000,
        });
      })
        .catch(() => {
          toast.error("Error in adding job card Added!", {
  duration: 3000,
});
        });
      setForm({
        companyName: "",
        role: "",
        jobApplicationLink: "",
        dateApplied: "",
        priority: "Medium",
        location: "",
        notes: "",
      });
      console.log("Job added successfully");
      setOpen(false);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error adding job:", err);
    }
    finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get<Job[]>('/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }
    fetchJobs();
  }, [refresh]);

  const handleDelete = async (id: string) => {
  try {
    await axios.delete(`/api/jobs/${id}`);
    setJobs(prev => prev.filter(job => job._id !== id));
    toast.success("Job deleted successfully!");
  } catch (error) {
    console.error("Error deleting job:", error);
    toast.error("Failed to delete job");
  }
};

  return (
    <div className="w-full bg-linear-to-b from-slate-50 to-slate-100 p-4 overflow-x-auto">
      <div className="flex gap-6 min-w-max pb-4">
        {columns.map((col) => {
          const filteredJobs = jobs.filter((job) => job.status === col);
          return (
            <div
              key={col}
              className="w-[320px] shrink-0 border border-slate-200 bg-white rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 top-0 z-10">
                <div className="flex justify-between items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-700">
                    {col}
                  </h2>
                  {col === "Applied" && (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Plus size={18} />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Add Job</DialogTitle>
                          <DialogDescription>Enter your job details below.</DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="grid gap-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Company</Label>
                              <Input
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                required
                                autoFocus
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label>Role</Label>
                              <Input
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label>Application Link</Label>
                              <Input
                                name="jobApplicationLink"
                                value={form.jobApplicationLink}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label>Date Applied</Label>
                              <Input
                                type="date"
                                name="dateApplied"
                                value={form.dateApplied}
                                onChange={handleChange}
                                required
                              />
                            </div>

                            <div className="grid gap-2">
                              <Label>Priority</Label>
                              <Select
                                value={form.priority}
                                onValueChange={(val) =>
                                  setForm((prev) => ({ ...prev, priority: val }))
                                }
                              >
                                <SelectTrigger className="border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="High">High</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label>Location</Label>
                              <Input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label>Notes</Label>
                            <Textarea
                              name="notes"
                              value={form.notes}
                              onChange={handleChange}
                              placeholder="Any details or reminders..."
                            />
                          </div>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" type="button">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              type="submit"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {formLoading ? <>Creating ...</> : <>Add Job</>}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}


                </div>
              </div>

              <div className="p-3 flex flex-col gap-3">
                {filteredJobs.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center mt-6">
                    No cards here yet
                  </p>
                ) : (
                  filteredJobs.map((job) => <JobCard key={job._id} {...job} handelDelete={handleDelete}/>)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
