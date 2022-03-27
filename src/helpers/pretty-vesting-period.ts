import { prettifySeconds } from "./prettify-seconds";
import { secondsUntilBlock } from "./seconds-until-block";

export const prettyVestingPeriod = (currentBlock: number, vestingBlock: number) => {
    if (vestingBlock === 0) {
        return "Nothing to claim";
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const seconds = secondsUntilBlock(currentTime, vestingBlock);
    if (seconds < 0) {
        return "Fully Vested";
    }
    return prettifySeconds(seconds);
};
