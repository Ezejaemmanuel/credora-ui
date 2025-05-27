import { parseUnits } from "viem";
import { assetChainTestnet } from "viem/chains";

export const MAX_USDC_MINT_AMOUNT = parseUnits("100000", 6);

export const SUPPORTED_CHAIN = assetChainTestnet;
export const SUPPORTED_CHAIN_ID = SUPPORTED_CHAIN.id;
