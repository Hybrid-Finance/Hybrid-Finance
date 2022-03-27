import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULT_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import "./testnet-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { useDispatch } from "react-redux";
import { messages } from "../../../constants/messages";
import { success, warning, info, error } from "../../../store/slices/messages-slice";
import { MintableTokenContract } from "../../../abi";
import { ethers } from "ethers";
import { useWeb3Context } from "../../../hooks";
import { getBalances } from "../../../store/slices/account-slice";

function TestnetMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [usdtMinting, setUsdtMinting] = useState(false);
    const [usdcMinting, setUsdcMinting] = useState(false);
    const isEthereumAPIAvailable = window.ethereum;
    const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

    const networkID = useSelector<IReduxState, number>(state => {
        return (state.app && state.app.networkID) || DEFAULT_NETWORK;
    });
    const dispatch = useDispatch();

    const addresses = getAddresses(networkID);

    const USDCE_ADDRESS = addresses.USDCE_ADDRESS;
    const USDT_ADDRESS = addresses.USDCE_ADDRESS;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    const MintToken = (tokenSymbol: string, tokenAddress: string) => async () => {
        if (await checkWrongNetwork()) return;
        let mintAmount = 0;
        if (tokenAddress == USDT_ADDRESS) {
            if (usdtMinting) return;
            mintAmount = 10000000000;
        } else if (tokenAddress == USDCE_ADDRESS) {
            if (usdcMinting) return;
            mintAmount = 10000000000;
        }
        const signer = provider.getSigner();
        const TokenContract = new ethers.Contract(tokenAddress, MintableTokenContract, signer);
        const tokenBalance = await TokenContract.balanceOf(address);
        // if (tokenBalance >= mintAmount) {
        //     dispatch(warning({ text: `You already have enough ${tokenSymbol}` }));
        //     return;
        // }
        try {
            if (tokenAddress == USDT_ADDRESS) {
                setUsdtMinting(true);
            } else if (tokenAddress == USDCE_ADDRESS) {
                setUsdcMinting(true);
            }
            const mintTxn = await TokenContract.mint(mintAmount);
            dispatch(success({ text: messages.tx_successfully_send }));
            await mintTxn.wait();
            if (tokenAddress == USDT_ADDRESS) {
                setUsdtMinting(false);
            } else if (tokenAddress == USDCE_ADDRESS) {
                setUsdcMinting(false);
            }
            dispatch(info({ text: messages.your_balance_updated }));
            return;
        } catch (err: any) {
            dispatch(error({ text: messages.something_wrong, error: err }));
            return;
        }
    };

    return (
        <div className="time-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="time-menu-btn">
                <p>Mint</p>
            </div>

            <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link className="tooltip-item" href={`https://faucet.avax-test.network/`} target="_blank">
                                <p>Avax Faucet</p>
                            </Link>
                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="tooltip-item" onClick={MintToken("USDC", USDCE_ADDRESS)}>
                                        <p>{usdcMinting ? "Minting.." : "USDC"}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default TestnetMenu;
