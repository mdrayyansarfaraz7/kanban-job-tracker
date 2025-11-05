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
} from "lucide-react";
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
}

export default function JobCard({
  _id,
  companyName,
  role,
  status,
  dateApplied,
  jobApplicationLink,
  notes,
  order,
  meetingLinks = [],
  interviewRounds = [],
  offerDeadline,
  priority = "Medium",
  location,
  handelDelete,
}: JobCardProps) {

  const [isDeleting, setIsDeleting] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: _id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : isDeleting ? "not-allowed" : "grab",
  };

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await handelDelete(_id);
    } finally {
      setIsDeleting(false);
    }
  };
if (isDragging) console.log(`Dragging: ${companyName}`);

  const priorityColors = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border border-slate-200 hover:shadow-md transition-all duration-200 rounded-xl "
    >
      <CardContent className="p-4">
      
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {companyName}
            </h3>
            <p className="text-sm text-slate-500">{role}</p>
          </div>

          <Badge
            variant="outline"
            className={`text-xs font-medium ${priorityColors[priority]}`}
          >
            {priority}
          </Badge>
        </div>

  
        <div className="mt-3 space-y-1 text-sm text-slate-600">
          {location && (
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          )}

          {dateApplied && (
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarDays size={14} />
              <span>Applied on {new Date(dateApplied).toLocaleDateString("en-GB")}</span>
            </div>
          )}

          {jobApplicationLink && (
            <a
              href={jobApplicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              <Link2 size={14} /> Application Link
            </a>
          )}
        </div>

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
                      {round.date && (
                        <> — {new Date(round.date).toLocaleDateString("en-GB")}</>
                      )}
                      {round.feedback && (
                        <span className="text-slate-500 italic">
                          {" "}
                          ({round.feedback})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-end border-t pt-2">
        <button
          className={`text-slate-500 hover:text-red-600 transition flex items-center justify-center ${isDeleting ? "opacity-70 cursor-wait" : ""
            }`}
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin text-red-600" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </CardFooter>
    </Card>
  );
}
