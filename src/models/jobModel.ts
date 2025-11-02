import mongoose, { Schema, Document } from "mongoose";

export interface IJobCard extends Document {
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
  createdAt?: Date;
  updatedAt?: Date;
}

const JobCardSchema = new Schema<IJobCard>(
  {
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Offer Received", "Rejected"],
      default: "Applied",
    },
    dateApplied: { type: Date ,required:true},
    jobApplicationLink: { type: String },
    notes: { type: String },
    meetingLinks: [{ type: String }],
    interviewRounds: [
      {
        roundName: { type: String },
        date: { type: Date },
        feedback: { type: String },
      },
    ],
    offerDeadline: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "High",
    },
    location: { type: String },
    lastStatusChange: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.JobCard ||
  mongoose.model<IJobCard>("JobCard", JobCardSchema);
