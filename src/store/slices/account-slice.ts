import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StableReserveContract } from "../../abi/";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        hyfi: string;
        usdce: string;
        avax: string;
    };
    presale: {
        left: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const hyFiContract = new ethers.Contract(addresses.HYFI_ADDRESS, StableReserveContract, provider);
    const hyfiBalance = await hyFiContract.balanceOf(address);
    const remainingBalance = await hyFiContract.balanceOf(addresses.PRESALE_ADDRESS);

    const usdceContract = new ethers.Contract(addresses.USDCE_ADDRESS, StableReserveContract, provider);
    const usdceBalance = await usdceContract.balanceOf(address);

    const avaxBalance = await provider.getSigner().getBalance();

    return {
        balances: {
            hyfi: ethers.utils.formatUnits(hyfiBalance, "ether"),
            usdce: ethers.utils.formatUnits(usdceBalance, "mwei"),
            avax: ethers.utils.formatEther(avaxBalance),
        },
        presale: {
            left: ethers.utils.formatUnits(remainingBalance, "ether"),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        hyfi: string;
        usdce: string;
        avax: string;
    };
    allowance: {
        usdce: Number;
    };
    presale: {
        left: string;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let hyfiBalance = 0;
    let usdceBalance = 0;
    let usdceAllowance = 0;
    let remainingBalance = 0;

    const addresses = getAddresses(networkID);

    if (addresses.HYFI_ADDRESS) {
        const hyfiContract = new ethers.Contract(addresses.HYFI_ADDRESS, StableReserveContract, provider);
        hyfiBalance = await hyfiContract.balanceOf(address);
        remainingBalance = await hyfiContract.balanceOf(addresses.PRESALE_ADDRESS);
    }

    if (addresses.USDCE_ADDRESS) {
        const usdceContract = new ethers.Contract(addresses.USDCE_ADDRESS, StableReserveContract, provider);
        usdceAllowance = await usdceContract.allowance(address, addresses.PRESALE_ADDRESS);
        usdceBalance = await usdceContract.balanceOf(address);
    }

    const avaxBalance = await provider.getSigner().getBalance();

    return {
        balances: {
            hyfi: ethers.utils.formatUnits(hyfiBalance, "ether"),
            usdce: ethers.utils.formatUnits(usdceBalance, "mwei"),
            avax: ethers.utils.formatEther(avaxBalance),
        },
        allowance: {
            usdce: Number(usdceAllowance),
        },
        presale: {
            left: ethers.utils.formatUnits(remainingBalance, "ether"),
        },
    };
});

export interface IAccountSlice {
    balances: {
        hyfi: string;
        usdce: string;
        avax: string;
    };
    loading: boolean;
    allowance: {
        usdce: number;
    };
    presale: {
        left: string;
    };
}

const initialState: IAccountSlice = {
    loading: true,
    balances: { hyfi: "", usdce: "", avax: "" },
    allowance: { usdce: 0 },
    presale: { left: "" },
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
