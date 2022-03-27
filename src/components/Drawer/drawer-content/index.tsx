import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import HomeIcon from "../../../assets/icons/home.svg";
import StakeIcon from "../../../assets/icons/stake.svg";
import LeaderBoardIcon from "../../../assets/icons/bar.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import GovernanceIcon from "../../../assets/icons/governance.svg";
import HybridLogo from "../../../assets/icons/logos/logo_full.png";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import classnames from "classnames";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("home") >= 0 && page === "home") {
            return true;
        }
        if (currentPath.indexOf("presale") >= 0 && page === "presale") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <Link href="https://hyfinance.net" target="_blank">
                    <img alt="Hybrid Finance" src={HybridLogo} height="96" style={{ marginTop: "30px" }} />
                </Link>

                {address && (
                    <div className="wallet-link">
                        <Link href={`https://snowtrace.io/address/${address}`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link
                        component={NavLink}
                        to="/home"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "home");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={HomeIcon} />
                            <p>Home</p>
                        </div>
                    </Link>
                    <Link
                        component={NavLink}
                        to="/presale"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "presale");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={StakeIcon} />
                            <p>Presale</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="dapp-menu-doc-link"></div>
            <Social />
        </div>
    );
}

export default NavContent;
