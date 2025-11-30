'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'

interface MintBadgeProps {
 badgeId: string
 onSuccess?: (txHash: string) => void
 onError?: (error: Error) => void
}

// Predefined badge data matching BadgeService
const BADGE_DATA: Record<string, { name: string; description: string; milestone: string }> = {
 "first-contribution": {
  name: 'First Step',
  description: 'Awarded for making your first contribution',
  milestone: 'first_contribution'
 },
 "prs-10": {
  name: 'Code Warrior',
  description: 'Awarded for merging 10 Pull Requests',
  milestone: 'prs_10'
 }
}

export function MintBadge({ badgeId, onSuccess, onError }: MintBadgeProps) {
 const { address } = useAccount()
 const [isPending, setIsPending] = useState(false)

 const badgeInfo = BADGE_DATA[badgeId]

 if (!address) {
  return <div>Please connect your wallet first</div>
 }

 if (!badgeInfo) {
  return <div>Invalid badge ID</div>
 }

 const handleMint = async () => {
  setIsPending(true);
  try {
   const response = await fetch('/api/badges/mint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ badgeId }),
   });

   if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to mint badge');
   }

   const data = await response.json();
   console.log('Badge minted:', data.txHash);
   onSuccess?.(data.txHash);
  } catch (error) {
   console.error('Error minting badge:', error);
   onError?.(error as Error);
  } finally {
   setIsPending(false);
  }
 };

 return (
  <Button
   onClick={handleMint}
   disabled={isPending}
   className={`px-4 py-2 rounded text-white ${isPending ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
  >
   {isPending ? 'Minting...' : `Mint ${badgeInfo.name}`}
  </Button>
 )
}