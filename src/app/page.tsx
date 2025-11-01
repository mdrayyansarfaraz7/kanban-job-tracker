

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center from-gray-900 via-gray-950 to-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-blue-400">
          Kanban Job Tracker
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Streamline your job applications — track every stage, stay organized,
          and focus on landing your next opportunity.
        </p>
        <div className="mt-8">
          <button className="px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-medium shadow-lg">
            Coming Soon
          </button>
        </div>
      </div>
    </main>
  );
}

