'use client';

import { useUser, UserProfile } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function WalletRequirement() {
 const { user, isLoaded } = useUser();
 const [showUserProfile, setShowUserProfile] = useState(false);

 if (!isLoaded || !user) return null;

 // Check if user has any web3 wallet connected
 const hasWallet = user.web3Wallets && user.web3Wallets.length > 0;
 const showModal = !hasWallet;

 // If user is opening the profile to add a wallet
 if (showUserProfile) {
  return (
   <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-1 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
     <div className="absolute top-4 right-4 z-10">
      <Button
       variant="ghost"
       onClick={() => {
        setShowUserProfile(false);
       }}
       className="text-slate-400 hover:text-white"
      >
       Close
      </Button>
     </div>
     <div className="p-4 flex justify-center">
      <UserProfile />
     </div>
    </div>
   </div>
  )
 }

 // Blocking modal if no wallet
 if (showModal) {
  return (
   <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 max-w-md w-full shadow-2xl text-center">
     <h2 className="text-2xl font-bold text-white mb-4">Connect Web3 Wallet</h2>
     <p className="text-slate-400 mb-8">
      To use TaskChain, you must connect a Web3 wallet (MetaMask, Coinbase, etc.) to your account.
     </p>
     <Button
      onClick={() => setShowUserProfile(true)}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
     >
      Connect Wallet via Profile
     </Button>
    </div>
   </div>
  );
 }

 return null;
}
