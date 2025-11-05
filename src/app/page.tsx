'use client';
import HeaderBar from "@/components/HeaderBar";
import KanbanBoard from "@/components/KanbanBoard";
import { useState } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <HeaderBar refresh={refresh}/>
      <div className="mt-3">
      <KanbanBoard  refresh={refresh} setRefresh={setRefresh}/>
      </div>
    </main>
  );
}