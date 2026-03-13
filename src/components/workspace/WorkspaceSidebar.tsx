import { Folder, MessageSquare, Monitor, Tablet, Smartphone } from "lucide-react";

type DeviceMode = "desktop" | "tablet" | "mobile";
type OutputMode = "preview" | "code" | "split";

export function WorkspaceSidebar({
  activeProject,
  activeSession,
  onProjectChange,
  onSessionChange,
  outputMode,
  onOutputModeChange,
  deviceMode,
  onDeviceModeChange,
  onboardingVisible,
  onToggleOnboarding,
}: {
  activeProject: string;
  activeSession: string;
  onProjectChange: (projectId: string) => void;
  onSessionChange: (sessionId: string) => void;
  outputMode: OutputMode;
  onOutputModeChange: (mode: OutputMode) => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onboardingVisible: boolean;
  onToggleOnboarding: () => void;
}) {
  const projects = [
    { id: "still-web", name: "Still Web" },
    { id: "mobile-v2", name: "Mobile V2" },
  ];

  const sessions = [
    { id: "session-1", name: "Prompt iteration" },
    { id: "session-2", name: "UI copy review" },
  ];

  return (
    <aside className="h-full border-r border-stone-200 bg-stone-50 p-4">
      <div className="mb-6 flex items-center gap-2 text-stone-700">
        <Folder size={16} />
        <span className="text-sm font-medium">Workspace</span>
      </div>

      <label className="mb-2 block text-xs text-stone-500">Active project</label>
      <select
        value={activeProject}
        onChange={(e) => onProjectChange(e.target.value)}
        className="mb-4 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <label className="mb-2 block text-xs text-stone-500">Active session</label>
      <select
        value={activeSession}
        onChange={(e) => onSessionChange(e.target.value)}
        className="mb-4 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
      >
        {sessions.map((session) => (
          <option key={session.id} value={session.id}>
            {session.name}
          </option>
        ))}
      </select>

      <label className="mb-2 block text-xs text-stone-500">Output mode</label>
      <div className="mb-4 grid grid-cols-3 gap-2">
        {(["preview", "code", "split"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onOutputModeChange(mode)}
            className={`rounded-md px-2 py-1 text-xs capitalize ${
              outputMode === mode
                ? "bg-stone-800 text-white"
                : "bg-white text-stone-600 border border-stone-200"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      <label className="mb-2 block text-xs text-stone-500">Device mode</label>
      <div className="mb-4 flex gap-2">
        <button onClick={() => onDeviceModeChange("desktop")} className="rounded-md border border-stone-200 bg-white p-2">
          <Monitor size={14} className={deviceMode === "desktop" ? "text-stone-900" : "text-stone-500"} />
        </button>
        <button onClick={() => onDeviceModeChange("tablet")} className="rounded-md border border-stone-200 bg-white p-2">
          <Tablet size={14} className={deviceMode === "tablet" ? "text-stone-900" : "text-stone-500"} />
        </button>
        <button onClick={() => onDeviceModeChange("mobile")} className="rounded-md border border-stone-200 bg-white p-2">
          <Smartphone size={14} className={deviceMode === "mobile" ? "text-stone-900" : "text-stone-500"} />
        </button>
      </div>

      <button
        onClick={onToggleOnboarding}
        className="inline-flex items-center gap-2 text-xs text-stone-600 hover:text-stone-900"
      >
        <MessageSquare size={14} />
        {onboardingVisible ? "Hide" : "Show"} onboarding
      </button>
    </aside>
  );
}
