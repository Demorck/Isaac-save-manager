import { IEntity, findEntityById } from "../Helpers/Enums/IEntity.js";

export class Entity {
    private _name: string;
    private _id: number;
    private _variant: number;
    private _deaths: number;
    private _kills: number;
    private _hits: number;
    private _encounter: number;


    constructor(id: number, name: string, variant: number) {
        this._name = name;
        this._id = id;
        this._variant = variant;
        this._kills = 0;
        this._deaths = 0;
        this._hits = 0;
        this._encounter = 0;
    }

    public getName(): string {
        return this._name;
    }

    public getId(): number {
        return this._id;
    }
    
    public getVariant(): number {
        return this._variant;
    }

    public getKills(): number {
        return this._kills;
    }

    public getDeaths(): number {
        return this._deaths;
    }

    public getHits(): number {
        return this._hits;
    }

    public getEncounter(): number {
        return this._encounter;
    }


    public setKills(kills: number) {
        if (kills == undefined)
            kills = 0;
        this._kills = kills;
    }

    public setDeaths(deaths: number) {
        if (deaths == undefined)
            deaths = 0;
        this._deaths = deaths;
    }

    public setHits(hits: number) {
        if (hits == undefined)
            hits = 0;
        this._hits = hits;
    }

    public setEncounter(encounter: number) {
        if (encounter == undefined)
            encounter = 0;
        this._encounter = encounter;
    }


}