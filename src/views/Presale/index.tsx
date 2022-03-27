import * as React from "react";
import "./presale.scss";
import { ethers } from "ethers";
import { useWeb3Context } from "../../hooks";
import { messages } from "../../constants/messages";
import { success, info, error } from "../../store/slices/messages-slice";
import { useDispatch, useSelector } from "react-redux";
import { getGasPrice } from "src/helpers/get-gas-price";
import { PresaleContract } from "src/abi";
import { IReduxState } from "src/store/slices/state.interface";
import { changeApproval, changeStake } from "src/store/slices/stake-thunk";
import { useState, useCallback, useEffect } from "react";
import { Grid, InputAdornment, OutlinedInput, Zoom, SvgIcon, Button, Box, Card, CardContent, Typography, Link } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { getTokenPrice, trim } from "../../helpers";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import { ReactComponent as TelescopeImg } from "../../assets/icons/telescope.svg";
import { getAddresses, Networks } from "src/constants";

function Presale() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    const addresses = getAddresses(Networks.ETH);

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");
    const [avaxPrice, setAvaxPrice] = useState(0);

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const currentPrice = useSelector<IReduxState, string>(state => {
        return state.app.currentPrice;
    });
    const hyfiBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.hyfi;
    });
    const usdceBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.usdce;
    });
    const avaxBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.avax;
    });

    const usdceAllowance = useSelector<IReduxState, number>(state => {
        return state.account.allowance && state.account.allowance.usdce;
    });
    const leftBalance = useSelector<IReduxState, string>(state => {
        return state.account.presale && state.account.presale.left;
    });
    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onChangeStake = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (quantity === "" || parseFloat(quantity) === 0) {
            dispatch(warning({ text: "Please enter a valid amount" }));
        } else {
            await dispatch(changeStake({ address, action, value: String(quantity), provider, networkID: chainID }));
            setQuantity("");
        }
    };

    const hasAllowance = useCallback(
        token => {
            if (token === "usdce") return usdceAllowance > 0;
            return 0;
        },
        [usdceAllowance],
    );

    const getExpectedHyfi = () => {
        const quantityEntered = Number(quantity);
        let amount = quantityEntered;
        if (view == 1) {
            amount *= avaxPrice;
        }
        return trim(amount / Number(currentPrice), 4);
    };

    useEffect(() => {
        const getCurrentPrice = async () => {
            const presaleContract = new ethers.Contract(addresses.PRESALE_ADDRESS, PresaleContract, provider);
            const newAvaxPrice = (await presaleContract.avaxAssetPrice()) / Math.pow(10, 8);
            setAvaxPrice(newAvaxPrice);
        };
        getCurrentPrice();
    }, []);

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card mb-3">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">HyFi Presale</p>
                            </div>
                        </Grid>

                        <Grid item>
                            <div className="stake-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">Current Price</p>
                                            <p className="stake-card-metrics-value">{currentPrice ? <>$ {trim(Number(currentPrice), 2)}</> : <Skeleton width="150px" />}</p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} sm={4} md={4} lg={4}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">Tokens Remaining</p>
                                            <p className="stake-card-metrics-value">
                                                {leftBalance ? <>{new Intl.NumberFormat("en-US").format(Number(trim(Number(leftBalance), 0)))}</> : <Skeleton width="150px" />}
                                            </p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            {!address && (
                                <div className="stake-card-wallet-notification">
                                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="stake-card-wallet-desc-text">Connect your wallet to get HyFi tokens!</p>
                                </div>
                            )}
                            {address && (
                                <div>
                                    <div className="stake-card-action-area">
                                        <div className="stake-card-action-stage-btns-wrap">
                                            <div onClick={changeView(0)} className={classnames("stake-card-action-stage-btn", { active: !view })}>
                                                <p>USDC.e</p>
                                            </div>
                                            <div onClick={changeView(1)} className={classnames("stake-card-action-stage-btn", { active: view == 1 })}>
                                                <p>AVAX</p>
                                            </div>
                                        </div>

                                        <div className="stake-card-action-row">
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="stake-card-action-input"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                labelWidth={0}
                                            />

                                            {view === 0 && (
                                                <div className="stake-card-tab-panel">
                                                    {address && hasAllowance("usdce") ? (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "trading_usdce")) return;
                                                                onChangeStake("usdce");
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "trading_usdce", "Buy HyFi")}</p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "approve_usdce")) return;
                                                                onSeekApproval("usdce");
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "approve_usdce", "Approve USDC.e")}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {view === 1 && (
                                                <div className="stake-card-tab-panel">
                                                    <div
                                                        className="stake-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "trading_avax")) return;
                                                            onChangeStake("avax");
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "trading_avax", "Buy HyFi")}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="stake-card-action-help-text">
                                            {address && !hasAllowance("usdce") && view === 0 && (
                                                <p>Note: The "Approve" transaction is only needed when exchanging usdc.e for the first time.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="stake-user-data">
                                        {quantity && (
                                            <div className="data-row">
                                                <p className="data-row-name">Expected HyFi</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{getExpectedHyfi()} HyFi</>}</p>
                                            </div>
                                        )}
                                        {view === 0 && (
                                            <div className="data-row">
                                                <p className="data-row-name">USDC.e Balance</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(usdceBalance), 4)} USDC.e</>}</p>
                                            </div>
                                        )}
                                        {view === 1 && (
                                            <div className="data-row">
                                                <p className="data-row-name">AVAX Balance</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(avaxBalance), 6)} AVAX</>}</p>
                                            </div>
                                        )}
                                        <div className="data-row">
                                            <p className="data-row-name">HyFi Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(hyfiBalance), 4)} HyFi</>}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}
export default Presale;
