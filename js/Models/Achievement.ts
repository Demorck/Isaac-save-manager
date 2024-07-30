import { EAchievements } from "../Helpers/Enums/EAchievements.js";

export class Achievement {
    private _achievement: EAchievements;
    private _unlocked: boolean;

    constructor(name: string) {
        this._achievement = EAchievements.getAchievement(name);
        this._unlocked = false;
    }

    public toggleUnlocked(): void {
        this._unlocked = !this._unlocked;
    }

    public setUnlocked(value: boolean): void {
        this._unlocked = value;
    }

    public getID(): number {
        return parseInt(EAchievements[this._achievement]);
    }

    public get unlocked(): boolean {
        return this._unlocked;
    }

    public toString(): string {
        return this._achievement.toString();
    }
}