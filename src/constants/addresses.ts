import { Networks } from "./blockchain";

const ETH_MAINNET = {
    HYFI_ADDRESS: "0x4aF862b90539893575a1B2a3b97d990ECAE6a3BE",
    USDCE_ADDRESS: "0x3E62c625455b65100f1DaA9ED49d5185Cab3873f",
    PRESALE_ADDRESS: "0xbd1eE45eC94eeC60213b3a8cc0149d307bb44c68",
};

export const getAddresses = (networkID: number) => {
    if (networkID === Networks.ETH) return ETH_MAINNET;

    throw Error("Network don't support");
};
