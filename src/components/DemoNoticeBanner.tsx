import { CheckCircle2, Info, X } from 'lucide-react';

interface DemoNoticeBannerProps {
  message: string;
  variant?: 'info' | 'success';
  onDismiss: () => void;
}

export function DemoNoticeBanner({
  message,
  variant = 'info',
  onDismiss,
}: DemoNoticeBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 right-5 z-50 max-w-md bg-[#f5f0de] border border-[#D7CEAE] text-[#243329] px-4 py-3.5 rounded-lg shadow-md flex items-start gap-3"
    >
      {variant === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-[#406246] shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <Info className="w-5 h-5 text-[#406246] shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <p className="text-sm leading-snug flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="text-[#66736A] hover:text-[#243329] p-0.5 rounded focus-visible:outline-2 focus-visible:outline-[#406246] cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
