import { Constants } from "../Helpers/Constants";
import { Difficulty } from "../Helpers/Enums/Difficulty";
import { ECharacters } from "../Helpers/Enums/ECharacters";
import { Marks } from "../Helpers/Enums/Marks";
import { Manipulation } from "../Helpers/Manipulation";

export class SaveManager {
    private _data: Uint8Array;
    private _path: string;
    private _sectionOffsets: number[];


    private _achievements: number[];
    private _mark: number[][];
    private _challenges: number[];
    private _items: number[];
    private _version: number;
    

    constructor(path: string) {
        path = "/assets/" + path;
        this._path = path;
        this._data = new Uint8Array();
        this._sectionOffsets = new Array<number>();
        this._achievements = new Array<number>();
        this._mark = new Array<Array<number>>();
        this._challenges = new Array<number>();
        this._items = new Array<number>();
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

    public getSpecificMark(charIndex: number): number[] {
        return this._mark[charIndex];
    }

    public async load() {
        let response = await fetch(this._path);

        let buffer = await response.arrayBuffer();
        this._data = new Uint8Array(buffer);
        if (!this.testChecksum()) {
            throw new Error("Checksum failed");
        }

        this._sectionOffsets = Manipulation.getSectionOffsets(this._data);

        this._achievements = this.getAchievements();
        this._mark = this.getMark();
        this._challenges = this.getChallenges();
        this._items = this.getItems();
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
        console.log(currentOffset, difficulty);
        
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
        let challengesOffset = this._sectionOffsets[6];
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

}