import { http, createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { defineChain } from "viem";

// Define Celo Sepolia manually since it might not be in the version of wagmi/chains we have
export const celoSepolia = defineChain({
	id: 11142220,
	name: "Celo Sepolia",
	nativeCurrency: {
		decimals: 18,
		name: "Celo",
		symbol: "CELO",
	},
	rpcUrls: {
		default: {
			http: ["https://forno.celo-sepolia.celo-testnet.org"],
		},
	},
	blockExplorers: {
		default: { name: "Celo Explorer", url: "https://celo-sepolia.blockscout.com" },
	},
	testnet: true,
});

// Define Celo networks
export { celo, celoAlfajores };

export const config = createConfig({
	chains: [celoSepolia, celoAlfajores, celo],
	connectors: [metaMask()],
	transports: {
		[celo.id]: http(),
		[celoAlfajores.id]: http(),
		[celoSepolia.id]: http(),
	},
});
