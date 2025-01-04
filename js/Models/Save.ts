import { Constants } from "@/Helpers/Constants";
import { Difficulty } from "@/Helpers/Enums/Difficulty";
import { EAchievements } from "@/Helpers/Enums/EAchievements";
import { ECharacters } from "@/Helpers/Enums/ECharacters";
import { Versions } from "@/Helpers/Enums/Versions";
import { Entity } from "@/Models/Entity";
import { jsonEntity, entitiesByIdAndVariant } from "@/Helpers/Enums/IEntity";
import { Achievement } from "@/Models/Achievement";
import { Challenge } from "@/Models/Challenge";
import { Characters } from "@/Models/Characters";
import { Item } from "@/Models/Item";
import { Observable } from "@/Models/Observable";
import { SaveManager } from "@/Models/SaveManager";
import { Marks } from "@/Helpers/Enums/Marks";

export class Save extends Observable {
    private _manager: SaveManager;
    private _characters: Characters[];
    private _achievements: Achievement[];
    private _items: Item[];
    private _challenges: Challenge[];
    private _entities: Entity[];
    private _version: Versions;
    private _stats: Map<string, number>;

    constructor() {
        super();
        this._manager = new SaveManager();
        this._characters = new Array(Constants.NUMBER_OF_CHARACTERS);
        this._achievements = new Array(Constants.NUMBER_OF_ACHIEVEMENTS);
        this._items = new Array(Constants.NUMBER_OF_ITEMS);
        this._challenges = new Array(Constants.NUMBER_OF_CHALLENGES);
        this._entities = new Array(Constants.NUMBER_OF_ENTITIES);
        this._stats = new Map();
        this._version = Versions.UNDEFINED;

    }

    public async update(dataFile: Uint8Array): Promise<void> {
        await this.load(dataFile);
    }

    public async load(dataFile: Uint8Array): Promise<void> {
        this.notifyObservers({loading: true, loaded: false});

        try {
            await this._manager.load(dataFile);
        } catch (error) {
            
        }

        const populateTasks = [
            this.populateVersion.bind(this),
            this.populateCharacters.bind(this),
            this.populateAchievements.bind(this),
            this.populateItems.bind(this),
            this.populateChallenges.bind(this),
            this.populateEntities.bind(this),
            this.populateStats.bind(this),
        ];
    
        const runTasks = async (tasks: (() => void)[]) => {
            if (tasks.length === 0) return;
    
            const task = tasks.shift();
            task!();
    
            await new Promise((resolve) => requestAnimationFrame(resolve));
            await runTasks(tasks);
        };
    
        await runTasks([...populateTasks]);

        this.notifyObservers({loading: false, loaded: true});
    }

    private async runTaskWithDelay(task: () => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                task();
                resolve();
            }, 50); // Petit délai de 50 ms pour laisser respirer le navigateur
        });
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

        // this.notifyObservers({characters: this._characters});
    }

    private async populateAchievements(): Promise<void> {
        let numberAchievement = Constants.VERSION_LOADED == Versions.ONLINE ? Constants.NUMBER_OF_ONLINE_ACHIEVEMENTS : Constants.NUMBER_OF_ACHIEVEMENTS;
        for (let i = 0; i < numberAchievement; i++) {
            this._achievements[i] = new Achievement(EAchievements.getString(i));
            let unlocked = this._manager.achievements[i] == 1;
            this._achievements[i].setUnlocked(unlocked);            
        }

        
        // this.notifyObservers({achievements: this._achievements});
    }

    private populateItems(): void {
        for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
            let unlocked = this._manager.items[i] == 1;
            this._items[i] = new Item(i + 1);
            this._items[i].setSeen(unlocked);
        }

        // this.notifyObservers({items: this._items});
    }

    private populateChallenges(): void {
        for (let i = 0; i < Constants.NUMBER_OF_CHALLENGES; i++) {
            let done = this._manager.challenges[i] == 1;
            this._challenges[i] = new Challenge(i);
            this._challenges[i].setDone(done);
        }

        // this.notifyObservers({challenges: this._challenges});
    }

    private populateEntities(): void {
        for (let i = 0; i < Constants.NUMBER_OF_ENTITIES; i++) {
            let entity = jsonEntity[i];
            this._entities[i] = new Entity(entity.id, entity.name, entity.variant);
            this._entities[i].setKills(this._manager.kills[i]);
            this._entities[i].setDeaths(this._manager.deaths[i]);
            this._entities[i].setHits(this._manager.hits[i]);
            this._entities[i].setEncounter(this._manager.encounters[i]);
        }

        // this.notifyObservers({bestiary: this._entities});
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

    private populateStats(): void {
        this._stats = this._manager.stats;
        
        this.notifyObservers({stats: this._stats});
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

    public toggleMark(charId: number, markId: Marks, difficulty: Difficulty, type: Versions): void {
        let character = this._characters[charId];
        let mark = type == Versions.ONLINE ? character.getOnlineMarks().get(markId)! : character.getSoloMarks().get(markId)!;
        let bitwised = type == Versions.ONLINE ? Difficulty.getBitwisedDifficulty(mark, difficulty) : Difficulty.getBitwisedDifficulty(difficulty, mark);

        character.setMark(markId, difficulty, type);

        this._manager.setMark(charId, markId, bitwised);
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

    public toggleAchievement(id: number, unlocked: boolean): void {
        this._achievements[id - 1].setUnlocked(unlocked);
        this._manager.setAchievements(id, unlocked);
        this._manager.updateChecksum();

        this.notifyObservers({achievements: this._achievements});
    }

    public toggleItems(toggle: boolean = true): void {
        this._items.forEach((item) => {
            item.setSeen(toggle);
            this._manager.setItems(item.getID(), toggle);
        });

        this._manager.updateChecksum();

        this.notifyObservers({items: this._items});
    }

    public toggleItem(id: number, seen: boolean): void {
        this._items[id - 1].setSeen(seen);
        this._manager.setItems(id, seen);
        this._manager.updateChecksum();

        this.notifyObservers({items: this._items});
    }

    public toggleChallenges(toggle: boolean = true): void {
        this._challenges.forEach((challenge) => {
            challenge.setDone(toggle);
            this._manager.setChallenges(challenge.getID(), toggle);
        });

        this._manager.updateChecksum();

        this.notifyObservers({challenges: this._challenges});
    }

    public toggleChallenge(id: number, done: boolean): void {
        this._challenges[id].setDone(done);
        this._manager.setChallenges(id, done);
        this._manager.updateChecksum();

        this.notifyObservers({challenges: this._challenges});
    }

    public unlockSins(): void {
        this._manager.unlockSins();
        
        this.notifyObservers({sins: true});
    }

    public unlockBestiary(): void {        
        this._entities.forEach((entity) => {
            entity.setKills(1);
            entity.setDeaths(1);
            entity.setHits(1);
            entity.setEncounter(1);

            
            let entityIndex = entitiesByIdAndVariant[entity.getId()]?.[entity.getVariant()];
            this._manager.setEntity(entityIndex, entity.getDeaths(), entity.getKills(), entity.getHits(), entity.getEncounter());
        });

        let death = this._manager.getLengthBestiary(this._manager.deaths);
        let kills = this._manager.getLengthBestiary(this._manager.kills);
        let hits = this._manager.getLengthBestiary(this._manager.hits);
        let encounters = this._manager.getLengthBestiary(this._manager.encounters);
        
        this._manager.setBestiary(death, kills, hits, encounters);
        
        this._manager.updateChecksum();

        this.notifyObservers({bestiary: this._entities});
    }

    public get data(): Uint8Array {
        return this._manager.data;
    }

    public populateContent(tab: string): void {
        this.notifyObservers({loading: true, loaded: false});

        switch (tab) {
            case "marks":
                this.notifyObservers({characters: this._characters});
                break;
            case "achievements":
                this.notifyObservers({achievements: this._achievements});
                break;
            case "items":
                this.notifyObservers({items: this._items});
                break;
            case "challenges":
                this.notifyObservers({challenges: this._challenges});
                break;
            case "bestiary":
                this.notifyObservers({bestiary: this._entities});
                break;
            case "stats":
                this.notifyObservers({stats: this._stats});
                break;
            // case Tabs.OTHERS:
            //     this.notifyObservers({sins: true});
            default:
                break
        }

        this.notifyObservers({loading: false, loaded: true});
    }
}