import { Constants } from "../Helpers/Constants.js";
import { Difficulty } from "../Helpers/Enums/Difficulty.js";
import { EAchievements } from "../Helpers/Enums/EAchievements.js";
import { ECharacters } from "../Helpers/Enums/ECharacters.js";
import { Versions } from "../Helpers/Enums/Versions.js";
import { Manipulation } from "../Helpers/Manipulation.js";
import { Achievement } from "./Achievement.js";
import { Challenge } from "./Challenge.js";
import { Characters } from "./Characters.js";
import { Item } from "./Item.js";
import { Observable } from "./Observable.js";
import { SaveManager } from "./SaveManager.js";

export class Save extends Observable {
    private _manager: SaveManager;
    private _characters: Characters[];
    private _achievements: Achievement[];
    private _items: Item[];
    private _challenges: Challenge[];
    private _version: Versions;

    constructor() {
        super();
        this._manager = new SaveManager();
        this._characters = new Array(Constants.NUMBER_OF_CHARACTERS);
        this._achievements = new Array(Constants.NUMBER_OF_ACHIEVEMENTS);
        this._items = new Array(Constants.NUMBER_OF_ITEMS);
        this._challenges = new Array(Constants.NUMBER_OF_CHALLENGES);
        this._version = Versions.UNDEFINED;

    }

    public async update(dataFile: Uint8Array): Promise<void> {
        await this.load(dataFile);
    }

    public async load(dataFile: Uint8Array): Promise<void> {
        await this._manager.load(dataFile);

        this.populateVersion();
        this.populateCharacters();
        this.populateAchievements();  
        this.populateItems();
        this.populateChallenges();
    }

    private populateCharacters(): void {
        for (let i = 0; i < Constants.NUMBER_OF_CHARACTERS; i++) {
            this._characters[i] = new Characters(ECharacters.get(i), i);
            let markData = this._manager.getSpecificMark(i);

            for (let j = 0; j < Constants.NUMBER_OF_MARKS; j++) {
                let mark = j;
                let difficulty = markData[j];
                let soloDifficulty = Difficulty.getSoloDifficulty(difficulty);
                let onlineDifficulty = Difficulty.getOnlineDifficulty(difficulty);

                this._characters[i].setSoloMark(mark, soloDifficulty);
                this._characters[i].setOnlineMark(mark, onlineDifficulty);

            }
        }

        this.notifyObservers({characters: this._characters});
    }

    private populateAchievements(): void {
        let numberAchievement = Constants.VERSION_LOADED == Versions.ONLINE ? Constants.NUMBER_OF_ONLINE_ACHIEVEMENTS : Constants.NUMBER_OF_ACHIEVEMENTS;
        for (let i = 0; i < numberAchievement; i++) {
            this._achievements[i] = new Achievement(EAchievements.getString(i));
            let unlocked = this._manager.achievements[i] == 1;
            this._achievements[i].setUnlocked(unlocked);            
        }

        
        this.notifyObservers({achievements: this._achievements});
    }

    private populateItems(): void {
        for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
            let unlocked = this._manager.items[i] == 1;
            this._items[i] = new Item(i + 1);
            this._items[i].setSeen(unlocked);
        }

        let a = this._manager.getKills();
        console.log(this._manager.log());
        


        this.notifyObservers({items: this._items});
    }

    private populateChallenges(): void {
        for (let i = 0; i < Constants.NUMBER_OF_CHALLENGES; i++) {
            let done = this._manager.challenges[i] == 1;
            this._challenges[i] = new Challenge(i);
            this._challenges[i].setDone(done);
        }

        this.notifyObservers({challenges: this._challenges});
    }

    private populateVersion(): void {
        let version = this._manager.version;
        switch (version) {
            case Constants.LAST_VERSION:
                this._version = Versions.REPENTANCE;
                break;
            case Constants.ONLINE_VERSION:
                this._version = Versions.ONLINE;
                break;
            default:
                this._version = Versions.UNDEFINED;
                break
        }

        Constants.VERSION_LOADED = this._version;
        this.notifyObservers({version: this._version});
    }

    public toggleSoloMarks(difficulty: Difficulty = Difficulty.HARD): void {
        this._characters.forEach((character) => {
            let marks = character.getSoloMarks();
            let onlineMarks = character.getOnlineMarks();
            marks.forEach((_, index) => {
                let currentOnlineMark = onlineMarks.get(index)!;
                let bitwised = Difficulty.getBitwisedDifficulty(difficulty, currentOnlineMark);
                character.setSoloMark(index, difficulty);
                this._manager.setMark(character.getID(), index, bitwised);
            });
        });
        
        this._manager.updateChecksum();

        this.notifyObservers({characters: this._characters});
    }

    public toggleOnlineMarks(difficulty: Difficulty = Difficulty.ONLINE_HARD): void {
        this._characters.forEach((character) => {
            let marks = character.getOnlineMarks();
            let soloMarks = character.getSoloMarks();
            marks.forEach((_, index) => {
                let currentSoloMark = soloMarks.get(index)!;
                let bitwised = Difficulty.getBitwisedDifficulty(currentSoloMark, difficulty);
                character.setOnlineMark(index, difficulty);
                this._manager.setMark(character.getID(), index, bitwised);
                
            });
        });
        
        this._manager.updateChecksum();

        this.notifyObservers({characters: this._characters});
    }

    public toggleAchievements(toggle: boolean = true): void {
        this._achievements.forEach((achievement) => {
            achievement.setUnlocked(toggle);
            this._manager.setAchievements(achievement.getID(), toggle);
        });

        this._manager.updateChecksum();

        this.notifyObservers({achievements: this._achievements});
    }

    public get data(): Uint8Array {
        return this._manager.data;
    }
}