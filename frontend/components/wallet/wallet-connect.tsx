'use client'

import { Connect, Wallet } from "@composer-kit/ui/wallet";

export function WalletConnect() {
  return (
    <Wallet>
      <Connect
        label="Connect Wallet"
        onConnect={() => {
          console.log("Wallet connected");
        }}
      >
        Connect Wallet
      </Connect>
    </Wallet>
  );
}