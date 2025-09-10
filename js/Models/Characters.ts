import { Difficulty } from "@/Helpers/Enums/Difficulty";
import { ECharacters } from "@/Helpers/Enums/ECharacters";
import { Marks } from "@/Helpers/Enums/Marks";
import { Versions } from "@/Helpers/Enums/Versions";

export class Characters {
    private _character: ECharacters;
    private _tainted: boolean;
    private _soloMarks: Map<Marks, Difficulty>;
    private _onlineMarks: Map<Marks, Difficulty>;
    private _id: number;

    constructor(name: string, id: number) {
        this._character = ECharacters.getCharacter(name);
        this._tainted = ECharacters.isTainted(this._character);
        this._soloMarks = new Map<Marks, Difficulty>();
        this._onlineMarks = new Map<Marks, Difficulty>();
        this._id = id;
    }

    public setSoloMark(mark: Marks, difficulty: Difficulty): void {
        this._soloMarks.set(mark, difficulty);
    }

    public getSoloMark(mark: Marks): Difficulty {
        return this._soloMarks.get(mark) ?? Difficulty.NONE;
    }

    public getSoloMarks(): Map<Marks, Difficulty> {
        return new Map(this._soloMarks);
    }

    public setOnlineMark(mark: Marks, difficulty: Difficulty): void {
        this._onlineMarks.set(mark, difficulty);
    }

    public getOnlineMark(mark: Marks): Difficulty {
        return this._onlineMarks.get(mark) ?? Difficulty.NONE;
    }

    public setMark(mark: Marks, difficulty: Difficulty, type: Versions): void {
        if (type == Versions.ONLINE) {
            this.setOnlineMark(mark, difficulty);
        } else {
            this.setSoloMark(mark, difficulty);
        }
    }

    public getOnlineMarks(): Map<Marks, Difficulty> {
        return new Map(this._onlineMarks);
    }

    public getID(): number {
        return this._id;
    }

    public getName(): string {        
        return this._character.toString();
    }
}