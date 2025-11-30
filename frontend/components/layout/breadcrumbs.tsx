'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show breadcrumbs on home page or auth pages
  if (pathname === '/' || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }

  // Split path into segments
  const segments = pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    
    // Format segment name
    let label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Handle special cases
    if (segment.startsWith('[') && segment.endsWith(']')) {
      label = segment.slice(1, -1);
    }

    return { path, label, isLast };
  });

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="sticky top-0 z-40 bg-slate-950/98 backdrop-blur-md border-b border-sky-500/10 shadow-lg shadow-black/20">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 py-2.5 sm:py-3">
          {/* Back Button - Always visible and prominent on mobile */}
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/50 border border-sky-500/30 hover:border-sky-400/50 hover:from-slate-800 hover:to-slate-700/80 active:scale-95 transition-all shadow-md shadow-sky-500/10"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 sm:w-4.5 sm:h-4.5 text-sky-400" strokeWidth={2.5} />
          </button>

          {/* Breadcrumbs - Responsive layout */}
          <nav className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
            {/* Home icon - Hidden on very small screens when there are many segments */}
            <Link
              href="/"
              className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-slate-800/60 active:bg-slate-800 transition-all shrink-0 ${breadcrumbs.length > 2 ? 'hidden sm:flex' : 'flex'}`}
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
            </Link>

            {/* Show only last 2 segments on mobile, all on desktop */}
            {breadcrumbs.map((crumb, index) => {
              const isVisible = index >= breadcrumbs.length - 2 || breadcrumbs.length <= 2;
              const showOnDesktop = index < breadcrumbs.length - 2 && breadcrumbs.length > 2;
              
              return (
                <div 
                  key={crumb.path} 
                  className={`flex items-center gap-1.5 sm:gap-2 min-w-0 ${
                    !isVisible && showOnDesktop ? 'hidden sm:flex' : 'flex'
                  }`}
                >
                  <span className="text-slate-600 text-xs sm:text-sm">/</span>
                  {crumb.isLast ? (
                    <span className="text-xs sm:text-sm font-semibold text-sky-400 truncate max-w-[120px] sm:max-w-none">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="text-xs sm:text-sm text-slate-400 hover:text-sky-400 active:text-sky-300 transition-colors truncate max-w-[80px] sm:max-w-none"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
