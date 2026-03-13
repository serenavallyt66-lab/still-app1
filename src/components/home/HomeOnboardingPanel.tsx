import { Sparkles } from "lucide-react";

export function HomeOnboardingPanel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white/80 p-6 shadow-sm backdrop-blur">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-stone-600">
        <Sparkles size={14} />
        New workspace
      </div>
      <h2 className="text-xl font-semibold text-stone-800">Welcome to Still</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        Keep your sidebar, chat context, and output panel mounted while you switch modes.
        This shell is built for long sessions and fast context switching.
      </p>
      <button
        onClick={onClose}
        className="mt-4 text-sm text-stone-700 underline underline-offset-4 hover:text-stone-900"
      >
        Dismiss onboarding
      </button>
    </div>
  );
}
