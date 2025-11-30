'use client'

import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESSES, PERFORMANCE_TRACKER_ABI, REWARD_POOL_ABI, BADGE_NFT_ABI } from '@/lib/contracts'
import { useAccount } from 'wagmi'

export function UserStats() {
  const { address } = useAccount()

  // Read total points from PerformanceTracker
  const { data: totalPoints, isLoading: pointsLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.performanceTracker,
    abi: PERFORMANCE_TRACKER_ABI,
    functionName: 'getUserPoints',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read user rewards from RewardPool
  const { data: userRewards, isLoading: rewardsLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.rewardPool,
    abi: REWARD_POOL_ABI,
    functionName: 'getUserRewards',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Calculate available rewards (unclaimed)
  const availableRewards = userRewards?.filter((reward: { claimed: boolean; amount: bigint }) => !reward.claimed).reduce((sum: bigint, reward: { claimed: boolean; amount: bigint }) => sum + reward.amount, BigInt(0)) || BigInt(0)

  // Read badge count from BadgeNFT
  const { data: badgeCount, isLoading: badgesLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.badgeNFT,
    abi: BADGE_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  if (!address) {
    return <div>Please connect your wallet to view stats</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800">Total Points</h3>
        <p className="text-2xl font-bold text-blue-600">
          {pointsLoading ? '...' : totalPoints?.toString() || '0'}
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">Available Rewards</h3>
        <p className="text-2xl font-bold text-green-600">
          {rewardsLoading ? '...' : availableRewards?.toString() || '0'}
        </p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800">Badges Owned</h3>
        <p className="text-2xl font-bold text-purple-600">
          {badgesLoading ? '...' : badgeCount?.toString() || '0'}
        </p>
      </div>
    </div>
  )
}