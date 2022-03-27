import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Medium } from "../../../assets/icons/medium.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import { ReactComponent as DocsIcon } from "../../../assets/icons/docs.svg";

export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://docs.hybrid-finance.org/" target="_blank">
                <SvgIcon color="primary" component={DocsIcon} />
            </Link>
            <Link href="https://twitter.com/Hybrid_Finance" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>
            <Link href="https://hybridfinance.medium.com/" target="_blank">
                <SvgIcon viewBox="0 0 32 32" color="primary" component={Medium} />
            </Link>

            <Link href="https://discord.gg/sZFykyPWdC" target="_blank">
                <SvgIcon color="primary" component={Discord} />
            </Link>
        </div>
    );
}
