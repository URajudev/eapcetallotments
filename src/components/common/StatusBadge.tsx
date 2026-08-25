import React from 'react';
import { AllotmentStatus } from '../../types';
import { Sparkles, ArrowRightLeft, ArrowUpCircle, CheckCircle2, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: AllotmentStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'NEW_SEAT':
        return {
          label: 'NEW SEAT',
          icon: Sparkles,
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/70',
          dot: 'bg-emerald-500',
        };
      case 'TRANSFERRED':
        return {
          label: 'TRANSFERRED',
          icon: ArrowRightLeft,
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 hover:bg-indigo-100/70',
          dot: 'bg-indigo-500',
        };
      case 'UPGRADED_BRANCH':
        return {
          label: 'UPGRADED BRANCH',
          icon: ArrowUpCircle,
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100/70',
          dot: 'bg-amber-500',
        };
      case 'RETAINED':
        return {
          label: 'RETAINED',
          icon: CheckCircle2,
          bg: 'bg-sky-50 text-sky-700 border-sky-200/80 hover:bg-sky-100/70',
          dot: 'bg-sky-500',
        };
      case 'NO_SEAT':
      default:
        return {
          label: 'NO SEAT',
          icon: XCircle,
          bg: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/60',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 font-semibold tracking-wide gap-1 border',
    md: 'text-xs px-3 py-1 font-bold tracking-wider gap-1.5 border shadow-2xs',
    lg: 'text-sm px-4 py-1.5 font-bold tracking-wider gap-2 border shadow-xs',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      id={`badge-${status.toLowerCase()}`}
      className={`inline-flex items-center rounded-full transition-all duration-150 select-none uppercase ${config.bg} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" />}
      <span className="truncate">{config.label}</span>
    </span>
  );
};
