"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Link2,
  Trash2,
  Loader2,
  Video,
  ClipboardList,
  Clock,
  Pencil,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDraggable } from "@dnd-kit/core";

interface InterviewRound {
  roundName: string;
  date?: Date;
  feedback?: string;
}

interface JobCardProps {
  _id: string;
  companyName: string;
  role: string;
  status: "Applied" | "Interviewing" | "Offer Received" | "Rejected";
  dateApplied?: Date;
  jobApplicationLink?: string;
  notes?: string;
  meetingLinks?: string[];
  interviewRounds?: InterviewRound[];
  offerDeadline?: Date;
  order: number;
  priority?: "Low" | "Medium" | "High";
  location?: string;
  handelDelete: (_id: string) => Promise<void> | void;
  handelUpdate: (_id: string, updatedData: any) => Promise<void> | void;
}

export default function JobCard({
  _id,
  companyName,
  role,
  status,
  dateApplied,
  jobApplicationLink,
  notes,
  meetingLinks = [],
  interviewRounds = [],
  offerDeadline,
  priority = "Medium",
  location,
  handelDelete,
  handelUpdate
}: JobCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: _id,
  });

  const [formData, setFormData] = useState({
    notes: notes || "",
    meetingLinks: meetingLinks.length ? meetingLinks : [""],
    interviewRounds: interviewRounds.length
      ? interviewRounds.map((r) => ({ ...r, date: r.date ? new Date(r.date).toISOString().split("T")[0] : "" }))
      : [{ roundName: "", date: "", feedback: "" }],
    offerDeadline: offerDeadline ? new Date(offerDeadline).toISOString().split("T")[0] : "",
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const priorityColors = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  };

  const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await handelDelete(_id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Dynamic Meeting Links
  const handleMeetingChange = (index: number, value: string) => {
    const updated = [...formData.meetingLinks];
    updated[index] = value;
    setFormData({ ...formData, meetingLinks: updated });
  };
  const addMeeting = () => setFormData({ ...formData, meetingLinks: [...formData.meetingLinks, ""] });

  const removeMeeting = (index: number) =>
    setFormData({ ...formData, meetingLinks: formData.meetingLinks.filter((_, i) => i !== index) });

  const handleRoundChange = (index: number, field: keyof InterviewRound, value: string) => {
    const updated = [...formData.interviewRounds];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, interviewRounds: updated });
  };
  const addRound = () =>
    setFormData({
      ...formData,
      interviewRounds: [...formData.interviewRounds, { roundName: "", date: "", feedback: "" }],
    });
  const removeRound = (index: number) =>
    setFormData({ ...formData, interviewRounds: formData.interviewRounds.filter((_, i) => i !== index) });

  const [isSaving, setIsSaving] = useState(false);
    const [open, setOpen] = useState(false);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      console.log("Updated Data:", formData); 
      await handelUpdate(_id, formData); 
      setFormData({
        notes: "",
        meetingLinks: [""],
        interviewRounds: [{ roundName: "", date: "", feedback: "" }],
        offerDeadline: "",
      });
      setOpen(false); 
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card ref={setNodeRef} style={style} className="border border-slate-200 hover:shadow-md transition-all duration-200 rounded-xl">
      
      <div {...listeners} {...attributes} className="flex justify-between items-start p-4 cursor-grab select-none">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{companyName}</h3>
          <p className="text-sm text-slate-500">{role}</p>
        </div>

        <Badge variant="outline" className={`text-xs font-medium ${priorityColors[priority]}`}>
          {priority}
        </Badge>
      </div>

      <CardContent className="p-4 pt-0">
        {location && (
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
        )}

        {dateApplied && (
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <CalendarDays size={14} />
            <span>Applied on {new Date(dateApplied).toLocaleDateString("en-GB")}</span>
          </div>
        )}

        {jobApplicationLink && (
          <a
            href={jobApplicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-1"
          >
            <Link2 size={14} /> Application Link
          </a>
        )}

        {notes && (
          <div className="mt-3 border-t pt-2 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Notes:</p>
            <p className="line-clamp-3">{notes}</p>
          </div>
        )}

        {offerDeadline && (
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <Clock size={14} className="text-blue-500" />
            Offer Deadline:{" "}
            <span className="font-medium text-slate-700">
              {new Date(offerDeadline).toLocaleDateString("en-GB")}
            </span>
          </div>
        )}

        {status !== "Applied" && (
          <>
            {meetingLinks.length > 0 && (
              <div className="mt-3 border-t pt-2 text-sm text-slate-600">
                <p className="font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Video size={14} className="text-blue-500" /> Meeting Links:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {meetingLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {interviewRounds.length > 0 && (
              <div className="mt-3 border-t pt-2 text-sm text-slate-600">
                <p className="font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <ClipboardList size={14} className="text-blue-500" /> Interview Rounds:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  {interviewRounds.map((round, index) => (
                    <li key={index}>
                      <span className="font-medium">{round.roundName}</span>
                      {round.date && <> — {new Date(round.date).toLocaleDateString("en-GB")}</>}
                      {round.feedback && <span className="text-slate-500 italic"> ({round.feedback})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-2">
        {/* Edit Form Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button onClick={(e) => e.stopPropagation()}>
              <Pencil size={16} className="text-slate-500 hover:text-blue-600 transition" />
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-2xl w-full p-6 rounded-lg bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Edit Job Card</DialogTitle>
              <DialogDescription>Update notes, meetings, interview rounds, and offer deadline.</DialogDescription>
            </DialogHeader>

            <form className="space-y-4">
              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter notes..."
                  className="mt-1"
                />
              </div>
              {
                status == "Applied" ? (<></>) : (<>
                  <div>
                    <Label>Offer Deadline</Label>
                    <Input
                      type="date"
                      value={formData.offerDeadline}
                      onChange={(e) => setFormData({ ...formData, offerDeadline: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Meeting Links</Label>
                    <div className="space-y-2 mt-1">
                      {formData.meetingLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={link}
                            onChange={(e) => handleMeetingChange(index, e.target.value)}
                            placeholder="Meeting link "
                          />
                          <Button variant="outline" size="sm" onClick={() => removeMeeting(index)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button type='button' variant="outline" size="sm" onClick={addMeeting} className="mt-1">
                        <Plus size={16} className="mr-1" /> Add Meeting
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Interview Rounds</Label>
                    <div className="space-y-2 mt-1">
                      {formData.interviewRounds.map((round, index) => (
                        <div key={index} className="grid grid-cols-3 gap-2 items-end">
                          <Input
                            value={round.roundName}
                            onChange={(e) => handleRoundChange(index, "roundName", e.target.value)}
                            placeholder="Round Name"
                          />
                          <Input
                            type="date"
                            value={round.date}
                            onChange={(e) => handleRoundChange(index, "date", e.target.value)}
                            placeholder="Date"
                          />
                          <Input
                            value={round.feedback}
                            onChange={(e) => handleRoundChange(index, "feedback", e.target.value)}
                            placeholder="Feedback"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="col-span-1 mt-1"
                            onClick={() => removeRound(index)}
                          >
                            <Trash2 size={16} /> Remove Round
                          </Button>
                        </div>
                      ))}
                      <Button type='button' variant="outline" size="sm" onClick={addRound} className="mt-1">
                        <Plus size={16} className="mr-1" /> Add Interview Round
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="ghost">Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>

                </>)
              }

            </form>
          </DialogContent>
        </Dialog>

        <button
          className={`text-slate-500 hover:text-red-600 transition flex items-center justify-center ${isDeleting ? "opacity-70 cursor-wait" : ""
            }`}
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin text-red-600" /> : <Trash2 size={16} />}
        </button>
      </CardFooter>
    </Card>
  );
}
