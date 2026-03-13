type OutputMode = "preview" | "code" | "split";
type DeviceMode = "desktop" | "tablet" | "mobile";

export function OutputWorkspace({
  outputMode,
  deviceMode,
  hidden,
}: {
  outputMode: OutputMode;
  deviceMode: DeviceMode;
  hidden: boolean;
}) {
  return (
    <section className={`grid h-full grid-rows-[56px_1fr] bg-white ${hidden ? "hidden md:block opacity-40" : ""}`}>
      <div className="border-b border-stone-200 px-4 flex items-center justify-between text-sm font-medium text-stone-700">
        <span>Output workspace</span>
        <span className="text-xs font-normal capitalize text-stone-500">
          {outputMode} · {deviceMode}
        </span>
      </div>
      <div className="p-4 text-sm text-stone-600">
        <p>The output pane stays mounted and responds to shell-level mode state.</p>
        <div className="mt-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 text-xs">
          Preview frame placeholder ({deviceMode})
        </div>
      </div>
    </section>
  );
}
