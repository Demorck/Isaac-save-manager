import { Constants } from "../Helpers/Constants.js";
import { Difficulty } from "../Helpers/Enums/Difficulty.js";
import { ECharacters } from "../Helpers/Enums/ECharacters.js";
import { jsonEntity, findEntityById, entitiesByIdAndVariant, Entities } from "../Helpers/Enums/IEntity.js";
import { Marks } from "../Helpers/Enums/Marks.js";
import { Manipulation } from "../Helpers/Manipulation.js";

export class SaveManager {
    private _data: Uint8Array;
    private _sectionOffsets: number[];
    private _bestiaryOffsets: number[];

    private _sins: number[];
    private _achievements: number[];
    private _mark: number[][];
    private _challenges: number[];
    private _items: number[];
    private _version: number;

    private _deaths: number[];
    private _kills: number[];
    private _hits: number[];
    private _encounters: number[];
    

    constructor() {
        this._data = new Uint8Array();
        this._sectionOffsets = new Array<number>();
        this._bestiaryOffsets = new Array<number>();
        this._achievements = new Array<number>();
        this._mark = new Array<Array<number>>();
        this._challenges = new Array<number>();
        this._items = new Array<number>();
        this._sins = new Array<number>();

        this._deaths = new Array<number>();
        this._kills = new Array<number>();
        this._hits = new Array<number>();
        this._encounters = new Array<number>();

        this._version = 0;
    }

    public get achievements(): number[] {
        return this._achievements;
    }

    public get mark(): number[][] {
        return this._mark;
    }

    public get challenges(): number[] {
        return this._challenges;
    }

    public get items(): number[] {
        return this._items;
    }

    public get data(): Uint8Array {
        return this._data;
    }

    public get version(): number {
        return this._version;
    }

    public get deaths(): number[] {
        return this._deaths;
    }

    public get kills(): number[] {
        return this._kills;
    }

    public get hits(): number[] {
        return this._hits;
    }

    public get encounters(): number[] {
        return this._encounters;
    }

    public getSpecificMark(charIndex: number): number[] {
        return this._mark[charIndex];
    }

    public async load(dataFile: Uint8Array): Promise<void> {
        this._data = dataFile;
        if (!this.testChecksum()) {
            console.log("Checksum is invalid, updating...");
            
            this.updateChecksum();
        }

        this._sectionOffsets = Manipulation.getSectionOffsets(this._data);
        this._bestiaryOffsets = Manipulation.getBestiaryOffsets(this._data, this._sectionOffsets);
    

        this._achievements = this.getAchievements();
        this._mark = this.getMark();
        this._challenges = this.getChallenges();
        this._items = this.getItems();
        this._sins = this.getSins();  

        console.log(this._sins);
        
        
        this._deaths = this.getDeaths();
        this._kills = this.getKills();
        this._hits = this.getHits();
        this._encounters = this.getEncouters();

        this._version = Manipulation.getInt(this._data, Constants.VERSION_OFFSET, 1);
    }

    public testChecksum(data: Uint8Array = this._data): boolean {
        let offset = Constants.HEADER_OFFSET;
        let length = data.length - offset - 4;
        let checksum = Manipulation.calculateChecksum(data, offset, length);
        let dataChecksum = data[offset + length]
        
        let test = Manipulation.testChecksum(checksum, dataChecksum)
        return test;
    }

    public updateChecksum(data: Uint8Array = this._data): void {
        this._data = Manipulation.updateChecksum(data);
    }

    private getMark(): number[][] {
        let markData = new Array<Array<number>>(Constants.NUMBER_OF_CHARACTERS);
        for (let i = 0; i < Constants.NUMBER_OF_CHARACTERS; i++) {
            markData[i] = this.getChecklistUnlocks(i);
        }

        return markData;
    }

    private getSins(): number[] {
        let sinsOffset = this._sectionOffsets[2] - Constants.NUMBER_OF_ONLINE_SINS * 4 - 0x4 * 3;
        
        let sins = new Array<number>(Constants.NUMBER_OF_ONLINE_SINS);
        for (let i = 0; i < Constants.NUMBER_OF_ONLINE_SINS; i++) {
            let int = Manipulation.toUint32(this._data, sinsOffset);
            sins[i] = int;
            sinsOffset += 4;
        }

        return sins;
    }

    private setSins(index: number, value: number): void {
        let sinsOffset = this._sectionOffsets[2] - Constants.NUMBER_OF_ONLINE_SINS * 4 - 0x4 * 3 + index * 4;
        
        this._data[sinsOffset] = value;
        this._sins[index] = value;
    }

    public unlockSins(): void {
        let online = this._sectionOffsets[2] - Constants.NUMBER_OF_ONLINE_SINS * 4 - 0x4 * 5;
        this._data[online] = 1;

        for (let i = 0; i < Constants.NUMBER_OF_ONLINE_SINS; i++) {
            this.setSins(i, 69);
        }
    }

    private getChecklistUnlocks(charIndex: number): number[] {
        let resultData = new Array<number>(Constants.NUMBER_OF_MARKS);
        
        if (charIndex == 14) { // The Forgotten
            let offset = this._sectionOffsets[1] + 0x32C;
            for (let i = 0; i < Constants.NUMBER_OF_MARKS; i++) {
                let currentOffset = offset + i * 4;
                resultData[i] = Manipulation.getInt(this._data, currentOffset);
                if (i == 8)
                    offset += 0x4
                if (i == 9)
                    offset += 0x37C
                if (i == 10)
                    offset += 0x84
            }
        } else if (charIndex > 14) { // Characters from Repentance
            let offset = this._sectionOffsets[1] + 0x31C;
            for (let i = 0; i < Constants.NUMBER_OF_MARKS; i++) {
                let currentOffset = offset + charIndex * 4 + i * 19 * 4;
                resultData[i] = Manipulation.getInt(this._data, currentOffset);
                if (i == 8)
                    offset += 0x4C
                if (i == 9 || i == 10)
                    offset += 0x3C                
            }
        } else { // Characters before The Forgotten
            let offset = this._sectionOffsets[1] + 0x6C;
            for (let i = 0; i < Constants.NUMBER_OF_MARKS; i++) {
                let currentOffset = offset + charIndex * 4 + i * 14 * 4;
                resultData[i] = Manipulation.getInt(this._data, currentOffset);
                if (i == 5)
                    offset += 0x14
                if (i == 8)
                    offset += 0x3C
                if (i == 9)
                    offset += 0x3B0
                if (i == 10)
                    offset += 0x50
            }
        }

        return resultData;
    }

    public setMark(charIndex: number, mark: Marks, difficulty: Difficulty): void {
        let currentOffset: number = 0x00;
        if (charIndex == 14) { // The Forgotten
            let offset = this._sectionOffsets[1] + 0x32C;
            for (let i = 0; i <= mark; i++) {
                currentOffset = offset + i * 4;
                if (i == 8)
                    offset += 0x4
                if (i == 9)
                    offset += 0x37C
                if (i == 10)
                    offset += 0x84
            }
        } else if (charIndex > 14) { // Characters from Repentance
            let offset = this._sectionOffsets[1] + 0x31C;
            for (let i = 0; i <= mark; i++) {
                currentOffset = offset + charIndex * 4 + i * 19 * 4;
                if (i == 8)
                    offset += 0x4C
                if (i == 9 || i == 10)
                    offset += 0x3C
            }
        } else { // Characters before The Forgotten
            let offset = this._sectionOffsets[1] + 0x6C;
            for (let i = 0; i <= mark; i++) {
                currentOffset = offset + charIndex * 4 + i * 14 * 4;
                if (i == 5)
                    offset += 0x14
                if (i == 8)
                    offset += 0x3C
                if (i == 9)
                    offset += 0x3B0
                if (i == 10)
                    offset += 0x50
            }
        }        
        this._data[currentOffset] = difficulty;
        this._mark[charIndex][mark] = difficulty;
    }

    private getAchievements(): number[] {
        let achievementsOffset = this._sectionOffsets[0];
        
        let achievements = new Array<number>(Constants.NUMBER_OF_ONLINE_ACHIEVEMENTS);
        for (let i = 0; i < Constants.NUMBER_OF_ONLINE_ACHIEVEMENTS; i++) {
            achievementsOffset++;
            let int = Manipulation.getInt(this._data, achievementsOffset, 1);
            achievements[i] = int;
        }

        return achievements
    }

    public setAchievements(index: number, done: boolean): void {
        let achievementsOffset = this._sectionOffsets[0];
        this._data[achievementsOffset + index] = done ? 1 : 0;
        this._achievements[index] = done ? 1 : 0;
    }

    private getChallenges(): number[] {
        let challengesOffset = this._sectionOffsets[9];
        let challenges = new Array<number>(Constants.NUMBER_OF_CHALLENGES);
        for (let i = 0; i < Constants.NUMBER_OF_CHALLENGES; i++) {
            challengesOffset++;
            let int = Manipulation.getInt(this._data, challengesOffset, 1);
            challenges[i] = int;
        }

        return challenges
    }

    private getItems(): number[] {
        let itemsOffset = this._sectionOffsets[3];
        let items = new Array<number>(Constants.NUMBER_OF_ITEMS);
        for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
            itemsOffset++;
            let int = Manipulation.getInt(this._data, itemsOffset, 1);
            items[i] = int;
        }

        return items
    }

    private getDeaths(): number[] {
        return this.getArrayBestiary(this._bestiaryOffsets[0]);
    }

    private getKills(): number[] {
        return this.getArrayBestiary(this._bestiaryOffsets[1]);
    }

    private getHits(): number[] {
        return this.getArrayBestiary(this._bestiaryOffsets[2]);
    }

    private getEncouters(): number[] {
        return this.getArrayBestiary(this._bestiaryOffsets[3]);
    }

    private getArrayBestiary(initialOffset: number): number[] {
        let bestiaryOffset = initialOffset;
        let length = Manipulation.toUint32(this._data, bestiaryOffset + 4) / 4;
        
        bestiaryOffset += 0x8;

        let str = "";
        
        let bestiary = new Array<number>(jsonEntity.length).fill(0);
        for (let i = 0; i < length; i++) {
            let variante = Manipulation.getInt(this._data, bestiaryOffset + 1, 1);
            let id1 = Manipulation.getInt(this._data, bestiaryOffset + 2, 1);
            let id2 = Manipulation.getInt(this._data, bestiaryOffset + 3, 1);
            const combined = (id2 << 8) | id1;
            const id = combined >> 4;

            let value = Manipulation.toUint32(this._data, bestiaryOffset + 4);

            let entityIndex = entitiesByIdAndVariant[id]?.[variante];

            bestiaryOffset += 0x8;

            if (entityIndex === undefined)
            {
                // str += `id: ${id} variante: ${variante} value: ${value}, offset: ${bestiaryOffset.toString(16)}, id1/2 = ${id1.toString(16)} - ${id2.toString(16)}\n`;
                
                continue;
            }

            bestiary[entityIndex] = value;   

        }

        if (str !== "")
            console.log(str);
            
        
        return bestiary
    }

    private setArrayBestiary(array: number[], sectionNumber: number): number[] {
        let newData = new Array<number>();
        let offs = 0x00;
        newData[offs] = sectionNumber;
        newData[offs + 1] = 0;
        newData[offs + 2] = 0;
        newData[offs + 3] = 0;
        offs += 8;
        
        for (let i = 0; i < array.length; i++) {
            if (array[i] == 0)
                continue;

            let variante = jsonEntity[i].variant;
            let id = jsonEntity[i].id;
            let value = array[i];

            const recombined = id << 4;
            const id1 = recombined & 0xFF;
            const id2 = (recombined >> 8) & 0xFF;               

            newData[offs] = 0;
            newData[offs + 1] = variante;
            newData[offs + 2] = id1;
            newData[offs + 3] = id2;
            newData[offs + 4] = Manipulation.getUintArray(value)[0];
            newData[offs + 5] = Manipulation.getUintArray(value)[1];
            newData[offs + 6] = Manipulation.getUintArray(value)[2];
            newData[offs + 7] = Manipulation.getUintArray(value)[3];
            offs += 8;
        }
        
        let lengthArray = Manipulation.getUintArray((offs - 8) / 2);
        newData[4] = lengthArray[0];
        newData[5] = lengthArray[1];
        newData[6] = lengthArray[2];
        newData[7] = lengthArray[3];

        return newData;

    }

    public setBestiary(deaths: number, kills: number, hits: number, encounters: number): void {

        let bestiaryLength = deaths + kills + hits + encounters;

        // this.setArrayBestiary(this._bestiaryOffsets[0], deaths, this._deaths, 4, this._bestiaryOffsets[1]);
        // this.setArrayBestiary(this._bestiaryOffsets[1], kills, this._kills, 2, this._bestiaryOffsets[2]);
        // this.setArrayBestiary(this._bestiaryOffsets[2], hits, this._hits, 3, this._bestiaryOffsets[3]);
        // this.setArrayBestiary(this._bestiaryOffsets[3], encounters, this._encounters, 1, -4);

        let deaths_array = this.setArrayBestiary(this._deaths, 4);
        let kills_array = this.setArrayBestiary(this._kills, 2);
        let hits_array = this.setArrayBestiary(this._hits, 3);
        let encounters_array = this.setArrayBestiary(this._encounters, 1);

        let bestiary_data = new Array<number>();
        bestiary_data.push(...deaths_array);
        bestiary_data.push(...kills_array);
        bestiary_data.push(...hits_array);
        bestiary_data.push(...encounters_array);

        let tmpData = new Array<number>();
        tmpData.push(...this._data);
        tmpData.splice(this._bestiaryOffsets[0], bestiaryLength * 8, ...bestiary_data);

        this._data = new Uint8Array(tmpData);

        Manipulation.setBestiaryOffsets(this._data, this._bestiaryOffsets, bestiaryLength);
    }


    /**
     * death kills hits encounters
     * @param id 
     * @param kills 
     * @param deaths 
     * @param hits 
     * @param encounter 
     */
    public setEntity(id: number, deaths: number, kills: number, hits: number, encounter: number) {
        this._kills[id] = kills;
        this._deaths[id] = deaths;
        this._hits[id] = hits;
        this._encounters[id] = encounter;        
    }

    public getLengthBestiary(array: number[]): number {
        let length = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] != 0)
                length++;
        }

        return length * 4;
    }
}