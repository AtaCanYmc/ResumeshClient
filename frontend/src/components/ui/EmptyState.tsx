import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="col-span-full flex w-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <Icon className="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
