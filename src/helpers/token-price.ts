import axios from "axios";
import { ethers } from "ethers";
import { PresaleContract } from "src/abi";
import { getAddresses, Networks } from "src/constants";
import { useWeb3Context } from "src/hooks";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    // cache["USDC"] = data["usd-coin"].usd;
    // cache["OHM"] = data["olympus"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
