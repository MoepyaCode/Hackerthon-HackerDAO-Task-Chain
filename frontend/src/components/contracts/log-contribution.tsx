'use client'

import { useState } from 'react'
import { Transaction, TransactionButton, TransactionStatus } from '@composer-kit/ui/transaction'
import { CONTRACT_ADDRESSES, PERFORMANCE_TRACKER_ABI } from '@/lib/contracts'
import { useAccount } from 'wagmi'

interface LogContributionProps {
  contributionType: string
  points: number
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

export function LogContribution({ contributionType, points, onSuccess, onError }: LogContributionProps) {
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)

  if (!address) {
    return <div>Please connect your wallet first</div>
  }

  return (
    <Transaction
      chainId={44787} // Celo Alfajores
      onSuccess={(result) => {
        console.log('Contribution logged:', result)
        onSuccess?.(result.transactionHash)
        setIsPending(false)
      }}
      onError={(error) => {
        console.error('Error logging contribution:', error)
        onError?.(error as Error)
        setIsPending(false)
      }}
      transaction={{
        abi: PERFORMANCE_TRACKER_ABI,
        address: CONTRACT_ADDRESSES.performanceTracker,
        args: [address, contributionType, points],
        functionName: 'logContribution',
      }}
    >
      <TransactionButton
        className={`px-4 py-2 rounded text-white ${isPending ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isPending ? 'Logging...' : `Log ${contributionType} (+${points} points)`}
      </TransactionButton>
      <TransactionStatus />
    </Transaction>
  )
}