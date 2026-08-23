import React from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/50 transition-colors duration-150 hover:border-zinc-700/80 ${className}`}
    >
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
