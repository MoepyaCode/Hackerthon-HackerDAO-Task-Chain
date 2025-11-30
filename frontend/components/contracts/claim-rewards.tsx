'use client'

import { useState } from 'react'
import { Transaction, TransactionButton, TransactionStatus } from '@composer-kit/ui/transaction'
import { CONTRACT_ADDRESSES, REWARD_POOL_ABI } from '@/lib/contracts'
import { useAccount, useReadContract } from 'wagmi'

interface ClaimRewardsProps {
 onSuccess?: (txHash: string) => void
 onError?: (error: Error) => void
}

export function ClaimRewards({ onSuccess, onError }: ClaimRewardsProps) {
 const { address } = useAccount()
 const [isPending, setIsPending] = useState(false)

 // Get user rewards to find the first unclaimed one
 const { data: userRewards } = useReadContract({
  address: CONTRACT_ADDRESSES.rewardPool,
  abi: REWARD_POOL_ABI,
  functionName: 'getUserRewards',
  args: address ? [address] : undefined,
  query: {
   enabled: !!address,
  },
 })

 // Find the first unclaimed reward index
 const firstUnclaimedIndex = userRewards?.findIndex((reward: { claimed: boolean }) => !reward.claimed) ?? -1

 if (!address) {
  return <div>Please connect your wallet first</div>
 }

 if (firstUnclaimedIndex === -1) {
  return <div>No rewards available to claim</div>
 }

 return (
  <Transaction
   chainId={11142220} // Celo Sepolia
   onSuccess={async (result) => {
    console.log('Rewards claimed:', result)

    try {
     // Confirm claim in database
     const response = await fetch('/api/rewards/confirm-claim', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txHash: result.transactionHash }),
     })

     if (!response.ok) {
      console.error('Failed to confirm claim in database')
     }
    } catch (error) {
     console.error('Error confirming claim:', error)
    }

    onSuccess?.(result.transactionHash)
    setIsPending(false)
   }}
   onError={(error) => {
    console.error('Error claiming rewards:', error)
    onError?.(error as Error)
    setIsPending(false)
   }}
   transaction={{
    abi: REWARD_POOL_ABI,
    address: CONTRACT_ADDRESSES.rewardPool,
    args: [BigInt(firstUnclaimedIndex)],
    functionName: 'claimReward',
   }}
  >
   <TransactionButton
    className={`px-4 py-2 rounded text-white ${isPending ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
   >
    {isPending ? 'Claiming...' : 'Claim Rewards'}
   </TransactionButton>
   <TransactionStatus />
  </Transaction>
 )
}