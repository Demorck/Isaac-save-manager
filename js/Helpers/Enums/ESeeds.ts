export enum ESeeds {
    "Sl0W 4ME2" = 1,
    "HART BEAT",
    "CAM0 K1DD",
    "CAM0 F0ES",
    "CAM0 DR0P",
    "WH0A WHAT",
    "FART SNDS",
    "B00B T00B",
    "DYSL EX1A",
    "KEEP TRAK",
    "KEEP AWAY",
    "DRAW KCAB",
    "CHAM P10N",
    "1MN0 B0DY",
    "BL1N DEYE",
    "BASE MENT",
    "C0CK FGHT",
    "C0NF ETT1",
    "FEAR M1NT",
    "FRA1 DN0T",
    "CLST RPH0",
    "",
    "BL00 00DY",
    "BRWN SNKE",
    
}

export namespace ESeeds {
    export function get(index: number): ESeeds {
        const values = Object.values(ESeeds);
        if (index < 0 || index >= values.length) {
            throw new Error("Index out of bounds");
        }
        return values[index].valueOf() as ESeeds;
    }

    export function getString(index: number): string {
        return ESeeds.get(index).toString();
    }

    export function getSeed(name: string): ESeeds {
        const seed = Object.values(ESeeds).find(c => c.toString() === name);
        if (seed === undefined) {
            throw new Error("Special seed not found");
        }
        return seed.valueOf() as ESeeds;
    }
}