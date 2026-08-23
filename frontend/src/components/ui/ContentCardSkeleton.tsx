import React from 'react';

export const ContentCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-full min-h-[220px] animate-pulse flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="h-6 w-3/4 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-5 w-5 shrink-0 rounded-md bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <div className="mb-6 flex-1 space-y-2">
        <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-2/3 rounded-md bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="flex flex-1 flex-wrap gap-2">
          <div className="h-6 w-16 rounded-md bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-6 w-20 rounded-md bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div className="h-4 w-24 shrink-0 rounded-md bg-gray-200 dark:bg-gray-800"></div>
      </div>
    </div>
  );
};
