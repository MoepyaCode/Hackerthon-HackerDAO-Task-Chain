'use client';

import Link from 'next/link';
import { UserButton, OrganizationSwitcher, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-500/20 bg-slate-950/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(56,189,248,0.1)]">
      <div className="flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 text-white text-xs shadow-[0_0_10px_rgba(56,189,248,0.3)] group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300">
            TC
          </div>
          <span className="bg-gradient-to-r from-slate-100 to-sky-400 bg-clip-text text-transparent">TaskChain</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {isSignedIn ? (
            <>
              <OrganizationSwitcher
                hidePersonal={false}
                afterSelectOrganizationUrl="/organization/:slug"
                afterSelectPersonalUrl="/dashboard"
                createOrganizationMode="navigation"
                createOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: 'flex items-center',
                    organizationSwitcherTrigger: 'px-3 py-1.5 rounded-md bg-slate-900/50 border border-sky-500/20 hover:border-sky-500/40 transition-colors',
                    organizationPreviewAvatarBox: 'w-6 h-6',
                  },
                }}
              />
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.2)] hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-300">Start</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
