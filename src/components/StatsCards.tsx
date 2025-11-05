"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function StatsCards() {
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
  }, []);

  const data = [
    { label: "Applied", value: stats.applied },
    { label: "Interviewing", value: stats.interviewing },
    { label: "Offered", value: stats.offered },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="flex gap-2 mt-2 flex-wrap justify-center md:justify-start">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-blue-100 text-[#1e3a8a] rounded-md shadow-sm w-[120px] h-[55px] flex flex-col items-center justify-center hover:bg-[#aeeafc] transition cursor-pointer"
        >
          <span className="text-lg font-bold leading-tight">{item.value}</span>
          <span className="text-xs text-[#1e3a8a]/80">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
