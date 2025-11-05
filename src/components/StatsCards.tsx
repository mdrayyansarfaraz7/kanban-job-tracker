"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function StatsCards({ refresh }: { refresh: boolean }) {
  const [stats, setStats] = useState({
    applied: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/jobs");
        const jobs = res.data || [];
        setStats({
          applied: jobs.filter((j: any) => j.status === "Applied").length,
          interviewing: jobs.filter((j: any) => j.status === "Interviewing").length,
          offered: jobs.filter((j: any) => j.status === "Offer Received").length,
          rejected: jobs.filter((j: any) => j.status === "Rejected").length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [refresh]);

  const data = [
    { label: "Applied", value: stats.applied },
    { label: "Interviewing", value: stats.interviewing },
    { label: "Offered", value: stats.offered },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 w-full">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-linear-to-br from-blue-100 to-blue-200 text-[#1e3a8a] rounded-xl shadow-md h-[70px] flex flex-col items-center justify-center p-3 hover:scale-105 hover:shadow-lg transition-transform duration-300 cursor-pointer"
        >
          <span className="text-lg sm:text-xl font-bold leading-tight">{item.value}</span>
          <span className="text-xs sm:text-sm text-[#1e3a8a]/80">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
