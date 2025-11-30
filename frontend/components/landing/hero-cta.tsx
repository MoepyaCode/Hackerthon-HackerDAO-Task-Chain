'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faBullseye } from '@fortawesome/free-solid-svg-icons';

export function HeroCTA() {
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  if (!mounted) {
    return (
      <>
        <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300" disabled>
          Loading... <FontAwesomeIcon icon={faRocket} className="ml-2" />
        </Button>
        <Link href="/leaderboard" className="w-full">
          <Button size="lg" variant="outline" className="w-full border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400">
            View Leaderboard
          </Button>
        </Link>
      </>
    );
  }

  if (isSignedIn) {
    return (
      <>
        <Link href="/dashboard" className="w-full">
          <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300">
            Go to Dashboard <FontAwesomeIcon icon={faRocket} className="ml-2" />
          </Button>
        </Link>
        <Link href="/leaderboard" className="w-full">
          <Button size="lg" variant="outline" className="w-full border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400">
            View Leaderboard
          </Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/sign-up" className="w-full">
        <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300">
          Start Earning Now <FontAwesomeIcon icon={faRocket} className="ml-2" />
        </Button>
      </Link>
      <Link href="/leaderboard" className="w-full">
        <Button size="lg" variant="outline" className="w-full border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:border-sky-400">
          View Leaderboard
        </Button>
      </Link>
    </>
  );
}

export function BottomCTA() {
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);

  if (!mounted) {
    return (
      <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300" disabled>
        Loading... <FontAwesomeIcon icon={faBullseye} className="ml-2" />
      </Button>
    );
  }

  return (
    <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="w-full block">
      <Button size="lg" className="w-full text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-300">
        {isSignedIn ? "Go to Dashboard" : "Start Playing"} <FontAwesomeIcon icon={faBullseye} className="ml-2" />
      </Button>
    </Link>
  );
}
