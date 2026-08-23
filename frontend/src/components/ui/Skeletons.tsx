import React from 'react';

export const HeroSkeleton = () => (
  <div className="z-10 w-full flex-1 animate-pulse space-y-6 text-center lg:text-left">
    <div className="mx-auto h-16 w-3/4 rounded-2xl bg-gray-200 sm:h-20 lg:mx-0 lg:h-24 dark:bg-gray-800"></div>
    <div className="mx-auto mt-4 h-10 w-1/2 rounded-xl bg-gray-200 sm:h-12 lg:mx-0 dark:bg-gray-800"></div>
    <div className="mx-auto mt-6 max-w-2xl space-y-3 lg:mx-0">
      <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-800"></div>
    </div>
    <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row lg:justify-start">
      <div className="h-14 w-40 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-14 w-40 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
      <div className="mt-4 ml-0 flex gap-2 sm:mt-0 sm:ml-4">
        <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
      </div>
    </div>
  </div>
);

export const MetricsSkeleton = () => (
  <div className="grid w-full animate-pulse grid-cols-1 gap-4 py-8 md:grid-cols-4">
    <div className="h-48 rounded-3xl bg-gray-200 md:col-span-2 md:row-span-2 dark:bg-gray-800"></div>
    <div className="h-48 rounded-3xl bg-gray-200 md:col-span-2 dark:bg-gray-800"></div>
    <div className="h-48 rounded-3xl bg-gray-200 md:col-span-2 dark:bg-gray-800"></div>
  </div>
);

export const TimelineSkeleton = () => (
  <div className="w-full animate-pulse py-12">
    <div className="mx-auto mb-10 h-8 w-48 rounded bg-gray-200 xl:mx-0 dark:bg-gray-800"></div>
    <div className="relative space-y-8 pl-4 sm:pl-8">
      <div className="absolute top-2 bottom-2 left-4 w-0.5 rounded-full bg-gray-200 sm:left-8 dark:bg-gray-800" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative pl-8 sm:pl-12">
          <div className="absolute top-6 left-[-5px] h-3 w-3 rounded-full bg-gray-300 sm:left-[-5px] dark:bg-gray-700" />
          <div className="h-32 w-full rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ProjectsSkeleton = () => (
  <div className="w-full animate-pulse pt-8">
    <div className="mx-auto mb-6 h-8 w-48 rounded bg-gray-200 xl:mx-0 dark:bg-gray-800"></div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-40 w-full rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
      ))}
    </div>
  </div>
);

export const ArticlesSkeleton = () => (
  <div className="w-full animate-pulse pt-12">
    <div className="mb-6 flex items-center justify-center gap-3 xl:justify-start">
      <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-800"></div>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 w-full rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
      ))}
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="w-full animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="flex justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950/50">
      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800"></div>
    </div>
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between px-6 py-5">
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-4 w-1/5 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-4 w-1/6 rounded bg-gray-200 dark:bg-gray-800"></div>
          <div className="h-8 w-16 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ListSkeleton = () => (
  <div className="grid w-full animate-pulse grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="h-48 w-full rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
    ))}
  </div>
);
