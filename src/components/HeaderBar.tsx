"use client";
import { Card, CardContent } from "@/components/ui/card";
import StatsCards from "./StatsCards";

export default function HeaderBar() {
  return (
    <Card className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-col md:flex-row items-center justify-between">
      {/* Left Profile Section */}
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
        <div className="h-36 w-36 rounded-full overflow-hidden border border-slate-300 shadow-sm">
          <img
            src="/avatar.png"
            alt="Md Rayyan Sarfaraz"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-slate-800 font-semibold text-3xl">
            Md Rayyan Sarfaraz
          </h1>
          
          <p className="text-xs text-slate-500 font-medium mt-3">
            <span className="font-thin text-slate-700">Roles applied for:</span>{" "}
            MERN Developer | Frontend Developer | Backend Developer
          </p>
        </div>
      </div>

      {/* Right Title + Stats */}
      <div className="flex flex-col items-center md:items-start mt-4 md:mt-0 w-full md:w-auto">
        <h2 className="text-5xl font-bold text-[#1e3a8a]">
          Kanban Job Tracker
        </h2>
        <StatsCards />
      </div>
    </Card>
  );
}
