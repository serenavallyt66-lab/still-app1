'use client';

import { useState } from "react";
import { HomeOnboardingPanel } from "@/components/home/HomeOnboardingPanel";
import { ChatWorkspace } from "@/components/workspace/ChatWorkspace";
import { OutputWorkspace } from "@/components/workspace/OutputWorkspace";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";

type OutputMode = "preview" | "code" | "split";
type DeviceMode = "desktop" | "tablet" | "mobile";

export default function WorkspaceShell() {
  const [activeProject, setActiveProject] = useState("still-web");
  const [activeSession, setActiveSession] = useState("session-1");
  const [outputMode, setOutputMode] = useState<OutputMode>("split");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isOnboardingVisible, setOnboardingVisible] = useState(true);

  const showChat = outputMode !== "code";
  const showOutput = outputMode !== "preview";

  return (
    <main className="h-screen w-full overflow-hidden bg-[#fcfbf9] text-stone-900">
      <div className="grid h-full grid-cols-1 md:grid-cols-[260px_1fr_1fr]">
        <WorkspaceSidebar
          activeProject={activeProject}
          activeSession={activeSession}
          onProjectChange={setActiveProject}
          onSessionChange={setActiveSession}
          outputMode={outputMode}
          onOutputModeChange={setOutputMode}
          deviceMode={deviceMode}
          onDeviceModeChange={setDeviceMode}
          onboardingVisible={isOnboardingVisible}
          onToggleOnboarding={() => setOnboardingVisible((prev) => !prev)}
        />

        <div className={`h-full ${showChat ? "block" : "hidden md:block"}`}>
          <ChatWorkspace
            activeProject={activeProject}
            activeSession={activeSession}
            hidden={!showChat}
          />
        </div>

        <div className={`h-full ${showOutput ? "block" : "hidden md:block"}`}>
          <OutputWorkspace
            outputMode={outputMode}
            deviceMode={deviceMode}
            hidden={!showOutput}
          />
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-4 right-4 w-[320px] max-w-[calc(100vw-2rem)]">
        <div className="pointer-events-auto">
          <HomeOnboardingPanel
            visible={isOnboardingVisible}
            onClose={() => setOnboardingVisible(false)}
          />
        </div>
      </div>
    </main>
  );
}
