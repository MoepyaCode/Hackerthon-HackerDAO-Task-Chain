'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs">
            TC
          </div>
          <span>TaskChain</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Start</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
