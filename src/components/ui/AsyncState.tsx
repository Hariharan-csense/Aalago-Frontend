export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-20 text-charcoal/60">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-[3px] border-brand border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <p className="text-brand font-bold mb-2">Could not load data</p>
      <p className="text-charcoal/60 text-sm mb-4">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="px-4 py-2 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer">
          Try Again
        </button>
      )}
    </div>
  );
}
