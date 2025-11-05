"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { set } from "mongoose";

export default function KanbanBoard({
  refresh,
  setRefresh,
}: {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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

  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [interviewingJobs, setInterviewingJobs] = useState<Job[]>([]);
  const [offerJobs, setOfferJobs] = useState<Job[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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


  const getColumnData = (col: string) => {
    switch (col) {
      case "Applied":
        return appliedJobs;
      case "Interviewing":
        return interviewingJobs;
      case "Offer Received":
        return offerJobs;
      case "Rejected":
        return rejectedJobs;
      default:
        return [];
    }
  };

  const setColumnData = (col: string, jobs: Job[]) => {
    switch (col) {
      case "Applied":
        setAppliedJobs(jobs);
        break;
      case "Interviewing":
        setInterviewingJobs(jobs);
        break;
      case "Offer Received":
        setOfferJobs(jobs);
        break;
      case "Rejected":
        setRejectedJobs(jobs);
        break;
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get<Job[]>("/api/jobs");
        const jobs = res.data;
        const sort = (a: Job, b: Job) => (a.order ?? 0) - (b.order ?? 0);
        setAppliedJobs(jobs.filter((j) => j.status === "Applied").sort(sort));
        setInterviewingJobs(jobs.filter((j) => j.status === "Interviewing").sort(sort));
        setOfferJobs(jobs.filter((j) => j.status === "Offer Received").sort(sort));
        setRejectedJobs(jobs.filter((j) => j.status === "Rejected").sort(sort));
      } catch (err) {
        console.error(err);
        toast.error("Error fetching jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/jobs/${id}`);
      setAppliedJobs((prev) => prev.filter((job) => job._id !== id));
      setInterviewingJobs((prev) => prev.filter((job) => job._id !== id));
      setOfferJobs((prev) => prev.filter((job) => job._id !== id));
      setRejectedJobs((prev) => prev.filter((job) => job._id !== id));
      toast.success("Job deleted successfully!");
      setRefresh((p) => !p);
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
  };

  const handelUpdate= async( _id:string,updatedData:any)=>{
    try {
      await axios.put(`/api/jobs/${_id}`, updatedData);
      toast.success("Job updated successfully!");
      setRefresh((p) => !p);
      
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await axios.post("/api/jobs", { ...form, status: "Applied" });
      toast.success("Job Added!");
      setForm({
        companyName: "",
        role: "",
        jobApplicationLink: "",
        dateApplied: "",
        priority: "Medium",
        location: "",
        notes: "",
      });
      setOpen(false);
      setRefresh((p) => !p);
    } catch (err) {
      console.error(err);
      toast.error("Error adding job");
    } finally {
      setFormLoading(false);
    }
  };

  function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
      <div
        ref={setNodeRef}
        className={`w-[320px] shrink-0 rounded-xl border shadow-sm transition-colors ${
          isOver ? "bg-blue-50 border-blue-400" : "bg-white border-slate-200"
        }`}
      >
        {children}
      </div>
    );
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = String(active.id);
    const newStatus = over.id as Job["status"];

    const allColumns = {
      Applied: appliedJobs,
      Interviewing: interviewingJobs,
      "Offer Received": offerJobs,
      Rejected: rejectedJobs,
    };
    const oldCol = Object.keys(allColumns).find((col) =>
      allColumns[col as keyof typeof allColumns].some((job) => job._id === jobId)
    ) as keyof typeof allColumns;

    if (!oldCol || oldCol === newStatus) return;

    const jobToMove = allColumns[oldCol].find((j) => j._id === jobId);
    if (!jobToMove) return;

    const targetJobs = [...allColumns[newStatus as keyof typeof allColumns]];
    const newOrder = targetJobs.length ? targetJobs[targetJobs.length - 1].order + 1 : 1;
    const updatedOld = allColumns[oldCol].filter((j) => j._id !== jobId);
    const updatedNew = [...targetJobs, { ...jobToMove, status: newStatus, order: newOrder }];

    setColumnData(oldCol, updatedOld);
    setColumnData(newStatus, updatedNew);

    try {
      await axios.patch(`/api/jobs/${jobId}/update-status`, {
        status: newStatus,
        order: newOrder,
      });
      toast.success(`Moved to ${newStatus}`);
      setRefresh((p) => !p);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job status");
      setRefresh((p) => !p);
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-slate-50 to-slate-100 p-4 overflow-x-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
          <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
          <p className="text-sm">Loading your jobs...</p>
        </div>
      ) : (
        <>
          {/* Global Add Job Dialog */}
          <div className="flex justify-end mb-4">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus size={18} className="mr-2" /> Add Job
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
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Role</Label>
                      <Input
                        name="role"
                        value={form.role}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Application Link</Label>
                      <Input
                        name="jobApplicationLink"
                        value={form.jobApplicationLink}
                        onChange={(e) => setForm({ ...form, jobApplicationLink: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Date Applied</Label>
                      <Input
                        type="date"
                        name="dateApplied"
                        value={form.dateApplied}
                        onChange={(e) => setForm({ ...form, dateApplied: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Priority</Label>
                      <Select
                        value={form.priority}
                        onValueChange={(val) => setForm((prev) => ({ ...prev, priority: val }))}
                      >
                        <SelectTrigger>
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
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Notes</Label>
                    <Textarea
                      name="notes"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any details or reminders..."
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      {formLoading ? "Creating..." : "Add Job"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Kanban Board */}
          <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-6 min-w-max pb-4">
              {columns.map((col) => {
                const jobsInCol = getColumnData(col);
                return (
                  <DroppableColumn key={col} id={col}>
                    <div className="w-[320px] shrink-0 bg-white rounded-xl shadow-sm">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h2 className="text-base font-semibold text-slate-700">{col}</h2>
                      </div>

                      <div className="p-3 flex flex-col gap-3">
                        {jobsInCol.length === 0 ? (
                          <p className="text-slate-400 text-sm text-center mt-6">No cards here yet</p>
                        ) : (
                          jobsInCol.map((job) => (
                            <JobCard key={job._id} {...job} handelDelete={handleDelete} handelUpdate={handelUpdate}/>
                          ))
                        )}
                      </div>
                    </div>
                  </DroppableColumn>
                );
              })}
            </div>
          </DndContext>
        </>
      )}
    </div>
  );
}
