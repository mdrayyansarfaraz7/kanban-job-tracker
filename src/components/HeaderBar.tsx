"use client";
import { Card } from "@/components/ui/card";
import StatsCards from "./StatsCards";
import { Badge } from "@/components/ui/badge";

export default function HeaderBar({ refresh }: { refresh: boolean }) {
  const roles = ["MERN Developer", "Frontend Developer", "Backend Developer","Fullstack Developer"];

  return (
    <Card className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-col md:flex-row items-center justify-between">
   
      <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto mb-4 md:mb-0">
        
        <div className="hidden md:block h-36 w-36 rounded-full overflow-hidden border border-slate-300 shadow-sm shrink-0">
          <img
            src="/avatar.png"
            alt="Md Rayyan Sarfaraz"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="text-center md:text-left w-full">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">
            Md Rayyan Sarfaraz
          </h1>

          {/* Roles as badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2 md:mt-3">
            {roles.map((role, index) => (
              <Badge key={index} variant="outline" className="text-xs md:text-sm">
                {role}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Right Title + Stats */}
      <div className="flex flex-col items-center md:items-start w-full md:w-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a8a] text-center md:text-left">
          Kanban Job Tracker
        </h2>
        <div className="mt-3 md:mt-2 w-full md:w-auto">
          <StatsCards refresh={refresh} />
        </div>
      </div>
    </Card>
  );
}
