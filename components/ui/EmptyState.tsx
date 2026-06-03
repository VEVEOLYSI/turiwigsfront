import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}>
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
          <Icon className="h-8 w-8 text-neutral-400" />
        </div>
      )}
      <div>
        <p className="text-base font-semibold text-neutral-900">{title}</p>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
