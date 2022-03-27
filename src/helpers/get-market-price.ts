import { ethers } from "ethers";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(networkID: Networks, provider: ethers.Signer | ethers.providers.Provider): Promise<number> {
    // const usdcKeeperAddress = usdcKeeper.getAddressForReserve(networkID);
    // const pairContract = new ethers.Contract(usdcKeeperAddress, LpReserveContract, provider);
    // const reserves = await pairContract.getReserves();
    // const marketPrice = (reserves[0] / reserves[1]) * Math.pow(10, 12);
    // return marketPrice;
    return 60000000000;
}
