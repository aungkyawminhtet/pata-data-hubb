import { Lock } from 'lucide-react';
import { AccessLevel } from '../types/hub';

interface AccessBadgeProps {
  level: AccessLevel;
}

export function AccessBadge({ level }: AccessBadgeProps) {
  if (level === AccessLevel.OPEN) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#406246] whitespace-nowrap shrink-0">
        <span className="inline-block w-1.5 h-1.5 bg-[#406246]" aria-hidden="true" />
        <span>Open</span>
      </span>
    );
  }

  if (level === AccessLevel.MEMBERS_ONLY) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B5416] bg-[#f5f0de] px-2 py-0.5 border border-[#E2D9BA] whitespace-nowrap shrink-0">
        <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>Members only</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C2D12] bg-[#FAF1EE] px-2 py-0.5 border border-[#E7CFC6] whitespace-nowrap shrink-0">
      <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>Restricted</span>
    </span>
  );
}
