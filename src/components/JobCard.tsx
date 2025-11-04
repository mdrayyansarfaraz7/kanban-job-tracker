"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Link2, Trash2, Edit3 } from "lucide-react";

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
  priority?: "Low" | "Medium" | "High";
  location?: string;
}

export default function JobCard({
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
}: JobCardProps) {
  const priorityColors = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
  };

  return (
    <Card className="border border-slate-200 hover:shadow-md transition-all duration-200 rounded-xl">
      <CardContent className="p-4">
        {/* Header */}
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

        {/* Job Info */}
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
              <span>
                Applied on {new Date(dateApplied).toLocaleDateString("en-GB")}
              </span>
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

        {/* Conditional Info */}
        {notes && (
          <div className="mt-3 border-t pt-2 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Notes:</p>
            <p className="line-clamp-3">{notes}</p>
          </div>
        )}

        {meetingLinks.length > 0 && (
          <div className="mt-2 border-t pt-2 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Meetings:</p>
            <ul className="list-disc list-inside">
              {meetingLinks.map((link, i) => (
                <li key={i}>
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
          <div className="mt-2 border-t pt-2 text-sm text-slate-600">
            <p className="font-medium text-slate-700 mb-1">Interview Rounds:</p>
            <ul className="space-y-1">
              {interviewRounds.map((r, i) => (
                <li key={i}>
                  <span className="font-medium">{r.roundName}</span>
                  {r.date && (
                    <span className="text-slate-500 ml-1">
                      ({new Date(r.date).toLocaleDateString("en-GB")})
                    </span>
                  )}
                  {r.feedback && (
                    <span className="block text-slate-500 text-xs mt-0.5">
                      {r.feedback}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {offerDeadline && (
          <div className="mt-2 border-t pt-2 text-sm text-slate-600">
            <p className="font-medium text-slate-700">
              Offer Deadline:{" "}
              <span className="text-blue-600">
                {new Date(offerDeadline).toLocaleDateString("en-GB")}
              </span>
            </p>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-between gap-2 border-t pt-2">
        <button className="text-slate-500 hover:text-blue-600 transition">
          <Edit3 size={16} />
        </button>
        <button className="text-slate-500 hover:text-red-600 transition">
          <Trash2 size={16} />
        </button>
      </CardFooter>
    </Card>
  );
}
