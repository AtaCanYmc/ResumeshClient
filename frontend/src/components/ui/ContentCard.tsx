import React from 'react';
import { cn } from '../../lib/utils';
import { ExternalLink } from 'lucide-react';

interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  tags?: string[];
  icon?: React.ReactNode;
  externalLink?: string;
  footerContent?: React.ReactNode;
}

export const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  (
    { className, title, description, tags, icon, externalLink, footerContent, onClick, ...props },
    ref
  ) => {
    const clickableProps = onClick
      ? {
          role: 'button',
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick(e as any);
            }
          },
          onClick,
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn(
          'group flex h-full min-h-[200px] flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 transition-colors duration-150 outline-none',
          onClick ? 'cursor-pointer hover:border-zinc-700/80 hover:bg-zinc-900/80' : '',
          className
        )}
        {...clickableProps}
        {...props}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3
            className="line-clamp-1 text-base font-semibold text-zinc-100 transition-colors group-hover:text-white"
            title={title}
          >
            {title}
          </h3>
          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-zinc-500 transition-colors hover:text-zinc-200"
              aria-label={`${title} linkine git`}
            >
              {icon || <ExternalLink size={18} />}
            </a>
          )}
          {!externalLink && icon && <div className="text-zinc-500">{icon}</div>}
        </div>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">
          {description || 'Açıklama bulunmuyor.'}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4">
          {tags && tags.length > 0 && (
            <div className="flex flex-1 flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[11px] text-zinc-400"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[11px] text-zinc-500">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
          {footerContent && (
            <div className="ml-auto flex flex-shrink-0 items-center space-x-2 font-mono text-xs text-zinc-500">
              {footerContent}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ContentCard.displayName = 'ContentCard';
