import HeaderBar from "@/components/HeaderBar";
import KanbanBoard from "@/components/KanbanBoard";

export default function Home() {

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <HeaderBar/>
      <div className="mt-3">
      <KanbanBoard/>
      </div>
    </main>
  );
}