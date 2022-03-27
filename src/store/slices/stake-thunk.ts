import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StableReserveContract, PresaleContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";

interface IChangeApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("stake/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const usdceContract = new ethers.Contract(addresses.USDCE_ADDRESS, StableReserveContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "usdce") {
            approveTx = await usdceContract.approve(addresses.PRESALE_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const text = "Approve " + token.toUpperCase();
        const pendingTxnType = "approve_" + token;

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        dispatch(success({ text: messages.tx_successfully_send }));
        await approveTx.wait();
    } catch (err: any) {
        dispatch(error({ text: messages.something_wrong, error: err.message }));
        return;
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    const usdceAllowance = await usdceContract.allowance(address, addresses.PRESALE_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            allowance: {
                usdce: Number(usdceAllowance),
            },
        }),
    );
});

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeStake = createAsyncThunk("stake/changeStake", async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const presaleContract = new ethers.Contract(addresses.PRESALE_ADDRESS, PresaleContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "usdce") {
            stakeTx = await presaleContract.buy(ethers.utils.parseUnits(value, "mwei"), { gasPrice });
        } else if (action == "avax") {
            stakeTx = await presaleContract.buyAvax(ethers.utils.parseUnits(value, "ether"), { value: ethers.utils.parseUnits(value, "ether"), gasPrice });
        } else {
            dispatch(warning({ text: "Wrong token. Fix it" }));
            return;
        }
        const pendingTxnType = action;
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: action, type: pendingTxnType }));
        dispatch(success({ text: messages.tx_successfully_send }));
        await stakeTx.wait();
    } catch (err: any) {
        if (err.code === -32603 && err.message.indexOf("ds-math-sub-underflow") >= 0) {
            dispatch(error({ text: "You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow", error: err }));
        } else {
            dispatch(error({ text: messages.something_wrong, error: err }));
        }
        return;
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
