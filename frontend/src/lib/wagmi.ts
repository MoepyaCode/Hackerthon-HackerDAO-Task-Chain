import { http, createConfig } from "wagmi";
import { celo, celoAlfajores } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

// Define Celo networks (using built-in definitions from wagmi)
export { celo, celoAlfajores };

export const config = createConfig({
	chains: [celoAlfajores, celo],
	connectors: [metaMask()],
	transports: {
		[celo.id]: http(),
		[celoAlfajores.id]: http(),
	},
});
