import { Constants } from "../Constants.js";
import { Versions } from "./Versions.js";

export enum Difficulty {
    NONE = 0,
    NORMAL = 1,
    HARD = 2,
    ONLINE_NORMAL = 4,
    ONLINE_HARD = 8
}

export namespace Difficulty {
    export function isOnline(difficulty: Difficulty): boolean {
        return difficulty >> 2 != 0;
    }

    export function getSoloDifficulty(difficulty: Difficulty): Difficulty {
        let tmp = difficulty & 0b11;
        if (tmp == 3)
            return Difficulty.HARD;
        return difficulty & 0b11;
    }

    export function getOnlineDifficulty(difficulty: Difficulty): Difficulty {
        let tmp = difficulty >> 2;
        if (tmp == 3)
            return Difficulty.HARD;
        return difficulty >> 2;
    }

    export function getBitwisedDifficulty(solo: Difficulty, online: Difficulty): Difficulty {
        if (Constants.VERSION_LOADED != Versions.ONLINE)
            return solo;
        if (solo == Difficulty.HARD)
            solo = Difficulty.HARD | Difficulty.NORMAL;
        online <<= 2;
        if (online == Difficulty.ONLINE_HARD)
            online = Difficulty.ONLINE_HARD | Difficulty.ONLINE_NORMAL;

        return online | solo;
    }
}