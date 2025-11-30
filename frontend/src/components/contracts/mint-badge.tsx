'use client'

import { useState } from 'react'
import { Transaction, TransactionButton, TransactionStatus } from '@composer-kit/ui/transaction'
import { CONTRACT_ADDRESSES, BADGE_NFT_ABI } from '@/lib/contracts'
import { useAccount } from 'wagmi'

interface MintBadgeProps {
  badgeId: number
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
}

// Predefined badge data
const BADGE_DATA = {
  1: {
    name: 'First Steps',
    description: 'Awarded for making your first contribution',
    milestone: 'first_contribution'
  },
  2: {
    name: 'Code Contributor',
    description: 'Awarded for multiple code contributions',
    milestone: 'code_contributor'
  }
}

export function MintBadge({ badgeId, onSuccess, onError }: MintBadgeProps) {
  const { address } = useAccount()
  const [isPending, setIsPending] = useState(false)

  const badgeInfo = BADGE_DATA[badgeId as keyof typeof BADGE_DATA]

  if (!address) {
    return <div>Please connect your wallet first</div>
  }

  if (!badgeInfo) {
    return <div>Invalid badge ID</div>
  }

  return (
    <Transaction
      chainId={44787} // Celo Alfajores
      onSuccess={(result) => {
        console.log('Badge minted:', result)
        onSuccess?.(result.transactionHash)
        setIsPending(false)
      }}
      onError={(error) => {
        console.error('Error minting badge:', error)
        onError?.(error as Error)
        setIsPending(false)
      }}
      transaction={{
        abi: BADGE_NFT_ABI,
        address: CONTRACT_ADDRESSES.badgeNFT,
        args: [address, badgeInfo.name, badgeInfo.description, badgeInfo.milestone],
        functionName: 'mintBadge',
      }}
    >
      <TransactionButton
        className={`px-4 py-2 rounded text-white ${isPending ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        {isPending ? 'Minting...' : `Mint ${badgeInfo.name}`}
      </TransactionButton>
      <TransactionStatus />
    </Transaction>
  )
}