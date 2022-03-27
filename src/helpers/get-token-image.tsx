import HyFiImg from "../assets/tokens/HYFI.png";
import TroveImg from "../assets/tokens/TROVE.svg";
import USDCImg from "../assets/tokens/USDC.svg";
import DAIImg from "../assets/tokens/DAI.svg";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "hyfi") {
        return toUrl(HyFiImg);
    } else if (name === "usdce") {
        return toUrl(USDCImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
