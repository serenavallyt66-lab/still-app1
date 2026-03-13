export function ChatWorkspace({
  activeProject,
  activeSession,
  hidden,
}: {
  activeProject: string;
  activeSession: string;
  hidden: boolean;
}) {
  return (
    <section className={`grid h-full grid-rows-[56px_1fr] border-r border-stone-200 bg-white ${hidden ? "hidden md:block opacity-40" : ""}`}>
      <div className="border-b border-stone-200 px-4 flex items-center text-sm font-medium text-stone-700">
        Chat workspace
      </div>
      <div className="p-4 text-sm text-stone-600">
        <p>Project: {activeProject}</p>
        <p>Session: {activeSession}</p>
        <p className="mt-4">Conversation remains mounted while output mode changes.</p>
      </div>
    </section>
  );
}
