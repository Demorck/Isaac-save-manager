import { Challenges } from "../Helpers/Enums/Challenges.js";

export class Challenge {
    private _name: string;
    private _id: number;
    private _kills: number;
    private _hits: number;
    private _encounter: number;


    constructor(id: number) {
        this._name = Challenges[id];
        this._id = id;
        this._kills = 0;
        this._hits = 0;
        this._encounter = 0;
    }
}