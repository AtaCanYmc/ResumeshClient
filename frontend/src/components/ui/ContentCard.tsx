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
    // Handle accessibility for clickable cards
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
          'group flex h-full min-h-[220px] flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ease-out outline-none dark:border-gray-800 dark:bg-gray-900',
          onClick
            ? 'cursor-pointer hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:border-gray-600'
            : '',
          className
        )}
        {...clickableProps}
        {...props}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3
            className="line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 md:text-xl dark:text-gray-100 dark:group-hover:text-blue-400"
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
              className="rounded-sm text-gray-400 transition-colors hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-500 dark:hover:text-white"
              aria-label={`${title} linkine git`}
            >
              {icon || <ExternalLink size={20} />}
            </a>
          )}
          {!externalLink && icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
        </div>

        <p className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
          {description || 'Açıklama bulunmuyor.'}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4">
          {tags && tags.length > 0 && (
            <div className="flex flex-1 flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
          {footerContent && (
            <div className="ml-auto flex flex-shrink-0 items-center space-x-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              {footerContent}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ContentCard.displayName = 'ContentCard';
