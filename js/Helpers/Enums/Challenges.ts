import {EAchievements} from "@/Helpers/Enums/EAchievements";

export enum Challenges {
    "Pitch Black" = 1,
    "High Brow",
    "Head Trauma",
    "Darkness Falls",
    "The Tank",
    "Solar System",
    "Suicide King",
    "Cat Got Your Tongue",
    "Demo Man",
    "Cursed!",
    "Glass Cannon",
    "When Life Gives You Lemons",
    "Beans!",
    "It's in the Cards",
    "Slow Roll",
    "Computer Savvy",
    "Waka Waka",
    "The Host",
    "The Family Man",
    "Purist",
    "XXXXXXXXL",
    "SPEED!",
    "Blue Bomber",
    "PAY TO PLAY",
    "Have a Heart",
    "I RULE!",
    "BRAINS!",
    "PRIDE DAY!",
    "Onan's Streak",
    "The Guardian",
    "Backasswards",
    "Aprils Fool",
    "Pokey Mans",
    "Ultra Hard",
    "Pong",
    "Scat Man",
    "Bloody Mary",
    "Baptism by Fire",
    "Isaac's Awakening",
    "Seeing Double",
    "Pica Run",
    "Hot Potato",
    "Cantripped!",
    "Red Redemption",
    "DELETE THIS"
}

export namespace Challenges {
    export function get(index: number): Challenges {
        const values = Object.values(Challenges);
        if (index < 0 || index >= values.length) {
            throw new Error("Index out of bounds");
        }
        return values[index].valueOf() as Challenges;
    }

    export function getChallenge(name: string): Challenges {
        const challenge = Object.values(Challenges).find(c => c.toString() === name);
        if (challenge === undefined) {
            throw new Error("Challenge not found");
        }
        return challenge.valueOf() as Challenges;
    }

    export function getID(name: string): number {
        return parseInt(Challenges[Challenges.getChallenge(name)]);
    }

    export function getString(index: number): string {
        return Challenges.get(index).toString();
    }
}