import { Challenges } from "../Helpers/Enums/Challenges.js";

export class Challenge {
    private _name: string;
    private _done: boolean;

    constructor(id: number) {
        this._name = Challenges[id];
        this._done = false;
    }

    public toggleDone(): void {
        this._done = !this._done;
    }

    public setDone(value: boolean): void {
        this._done = value;
    }

    public getID(): number {
        return Challenges.getID(this._name);
    }

    public getName(): string {
        return this._name;
    }

    public isDone(): boolean {
        return this._done;
    }

    public toString(): string {
        return this._name.toString();
    }
}