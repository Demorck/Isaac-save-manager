export enum ECharacters {
    Isaac = "Isaac",
    Magdalene = "Magdalene",
    Cain = "Cain",
    Judas = "Judas",
    BlueBaby = "Blue Baby",
    Eve = "Eve",
    Samson = "Samson",
    Azazel = "Azazel",
    Lazarus = "Lazarus",
    Eden = "Eden",
    TheLost = "The Lost",
    Lilith = "Lilith",
    Keeper = "Keeper",
    Apollyon = "Apollyon",
    TheForgotten = "The Forgotten",
    Bethany = "Bethany",
    JacobEsau = "Jacob & Esau",
    
    T_Isaac = "Tainted Isaac",
    T_Magdalene = "Tainted Magdalene",
    T_Cain = "Tainted Cain",
    T_Judas = "Tainted Judas",
    T_BlueBaby = "Tainted Blue Baby",
    T_Eve = "Tainted Eve",
    T_Samson = "Tainted Samson",
    T_Azazel = "Tainted Azazel",
    T_Lazarus = "Tainted Lazarus",
    T_Eden = "Tainted Eden",
    T_Lost = "Tainted Lost",
    T_Lilith = "Tainted Lilith",
    T_Keeper = "Tainted Keeper",
    T_Apollyon = "Tainted Apollyon",
    T_Forgotten = "Tainted Forgotten",
    T_Bethany = "Tainted Bethany",
    T_Jacob = "Tainted Jacob",
}

export namespace ECharacters {
    export function isTainted(character: ECharacters): boolean {
        return character.toString().includes("Tainted");
    }

    export function get(index: number): ECharacters {
        const values = Object.values(ECharacters);
        if (index < 0 || index >= values.length) {
            throw new Error("Index out of bounds");
        }
        return values[index].valueOf() as ECharacters;
    }

    export function getCharacter(name: string): ECharacters {
        const character = Object.values(ECharacters).find(c => c.toString() === name);
        if (character === undefined) {
            throw new Error("Character not found");
        }
        return character.valueOf() as ECharacters;
    }
}