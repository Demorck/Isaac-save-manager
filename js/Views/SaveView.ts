import {Constants} from "@/Helpers/Constants";
import {Difficulty} from "@/Helpers/Enums/Difficulty";
import {Marks} from "@/Helpers/Enums/Marks";
import {Versions} from "@/Helpers/Enums/Versions";
import {Utils} from "@/Helpers/Utils";
import {Achievement} from "@/Models/Achievement";
import {Challenge} from "@/Models/Challenge";
import {Characters} from "@/Models/Characters";
import {Item} from "@/Models/Item";
import {Observer} from "./Observer";
import {Entity} from "@/Models/Entity";
import {SaveController} from "@/Controllers/SaveController";

import {render, html, RenderRootNode} from 'lit-html';
import { getAchievementTemplate } from './Templates/AchievementTemplate';
import { getItemTemplate } from './Templates/ItemTemplate';
import { getChallengeTemplate } from './Templates/ChallengeTemplate';
import { getBestiaryTemplate } from './Templates/BestiaryTemplate';
import { getCharacterTemplate } from './Templates/CharacterTemplate';

export class SaveView implements Observer {
    private _achievements: HTMLElement;
    private _mark: HTMLElement;
    private _challenges: HTMLElement;
    private _items: HTMLElement;
    private _bestiary: HTMLElement;
    private _stats: HTMLElement;
    private _controller: SaveController;

    constructor(controller: SaveController) {
        this._achievements = document.getElementById("content-achievements")!;
        this._mark = document.getElementById("content-marks")!;
        this._items = document.getElementById("content-items")!;
        this._challenges = document.getElementById("content-challenges")!;
        this._bestiary = document.getElementById("content-bestiary")!;
        this._stats = document.getElementById("content-stats")!;
        this._controller = controller;
    }

    update(data: any) {
        if (data.achievements) 
            this.populateAchievements(data);

        if (data.characters) {         
            this.populateCharacters(data);
        }
        
        if (data.items) {         
            this.populateItems(data);
        }
        
        if (data.challenges) {
            this.populateChallenges(data);
        }
        
        if (data.bestiary) {
            this.populateBestiary(data);
        }

        if (data.stats) {
            this.populateStats(data);
        }

        if (data.loading && !data.loaded) {
            document.getElementById("loading")?.classList.remove("hidden");
        }

        if (!data.loading  && data.loaded) {
            document.getElementById("loading")?.classList.add("hidden");
        }

        if (data.error) {
            let a = document.querySelector(".error")! as HTMLDivElement;
            a.textContent = data.error;
            a.classList.remove("hidden");
        } else {
            let a = document.querySelector(".error")! as HTMLDivElement;
            a.textContent = "";
            a.classList.add("hidden");
        }
    }

    private populateItems(data: any) {
        let wrapper = this._items.querySelector(".wrapper")  as RenderRootNode;
        
        let items: Item[] = data.items.filter((i: Item) => i.getID() > 0);
        let pagesHtml: any[] = [];
        
        let count = 0;
        let countPage = 1;
        let currentRowHtml: any[] = [];
        let currentPageRowsHtml: any[] = [];

        items.forEach((item: Item, index: number) => {
            currentRowHtml.push(getItemTemplate(item, index, this._controller));
            count++;

            if (count % 20 === 0 || index === items.length - 1) {
                currentPageRowsHtml.push(html`<div class="flex flex-row flex-wrap sm:flex-nowrap">${currentRowHtml}</div>`);
                currentRowHtml = [];
            }

            if (count % 120 === 0 || index === items.length - 1) {
                pagesHtml.push(html`
                    <div class="flex-col gap-2 'flex animate-fade-in'}" data-page="${countPage}">
                        <div class="flex flex-1 border border-white/10 bg-black/20 backdrop-blur-sm shadow-lg flex-col rounded-3xl flex-wrap gap-2 p-4 items-center">
                            <h2 class="text-2xl font-upheaval text-gray-300 mb-2 tracking-wider">Page ${countPage}</h2>
                            ${currentPageRowsHtml}
                        </div>
                    </div>
                `);
                currentPageRowsHtml = [];
                countPage++;
            }
        });

        render(html`${pagesHtml}`, wrapper!);
    }

    private populateCharacters(data: any): void {
        let wrapper = this._mark.querySelector(".wrapper") as RenderRootNode;

        let charactersHTML = data.characters.map((character: Characters) => {
            return getCharacterTemplate(character, this._controller);
        });

        render(html`${charactersHTML}`, wrapper!);

        document.querySelectorAll(".legend-online").forEach(function (el) {
            if (Constants.VERSION_LOADED == Versions.ONLINE) {
                el.classList.remove("hidden");
            } else {
                el.classList.add("hidden");
            }
        });
    }

    private populateAchievements(data: any): void {    
        let wrapper = this._achievements.querySelector(".wrapper")  as RenderRootNode;

        let achievementsHTML = data.achievements.map((achievement: Achievement, index: number) => {
            return getAchievementTemplate(achievement, index, this._controller);
        });
    
        render(html`${achievementsHTML}`, wrapper!);
    }

    private populateChallenges(data: any): void {
        let wrapper = this._challenges.querySelector(".wrapper")  as RenderRootNode;

        let dlcELementHeader = (dlc: Versions) => {
            let string = "Undefined";
            let color = "text-gray-500";
            switch (dlc) {
                case Versions.REPENTANCE:
                    string = "Repentance";
                    color = "text-red-500";
                    break;
                case Versions.AFTERBIRTH_PLUS:
                    string = "Afterbirth+";
                    color = "text-green-500";
                    break;
                case Versions.AFTERBIRTH:
                    string = "Afterbirth";
                    color = "text-blue-500";
                    break;
                case Versions.REBIRTH:
                    string = "Rebirth";
                    color = "text-yellow-500";
                    break;
            }

            return html`<h1 class="text-3xl font-upheaval text-center mb-4 pb-2 border-b border-white/10 drop-shadow-sm ${color}">${string}</h1>`;
        }
        
        let currentVersionID = Constants.VERSION_LOADED >= Versions.REPENTANCE ? Versions.REPENTANCE : Constants.VERSION_LOADED;
        
        let dlcColumns = Array.from({length: currentVersionID}, (_, i) => {
            return {
                dlcVersion: i + 1,
                items: [] as any[]
            };
        });

        let j = 0;
        let max = Constants.CHALLENGES_ARRAY_DLC[j];
        
        data.challenges.forEach((challenge: Challenge, index: number) => {
            dlcColumns[j].items.push(getChallengeTemplate(challenge, index, this._controller));
            
            if (index == max - 1 && j + 1 < dlcColumns.length) {
                j++;
                max += Constants.CHALLENGES_ARRAY_DLC[j];
            }
        });

        let fragmentHTML = html`
            <div class="flex sm:flex-row justify-between gap-1 flex-col">
                ${dlcColumns.map(col => html`
                    <div class="p-4 flex flex-col items-stretch rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md shadow-xl sm:w-1/5 shrink-0" data-dlc="${col.dlcVersion}">
                        ${dlcELementHeader(col.dlcVersion)}
                        ${col.items}
                    </div>
                `)}
            </div>
        `;

        render(fragmentHTML, wrapper!);
    }

    private populateBestiary(data: any): void {
        let wrapper = this._bestiary.querySelector(".wrapper")  as RenderRootNode;

        let getPageHTML = (pageIndex: number, itemsHTML: any) => html`
            <div class="flex flex-col rounded-3xl border border-white/10 bg-black/30 backdrop-blur-sm shadow-lg flex-wrap sm:w-1/5 items-center gap-2 p-4">
                <h1 class="text-2xl font-upheaval text-gray-300 tracking-wider">Page ${pageIndex}</h1>
                <div class="flex flex-col flex-nowrap items-stretch justify-start flex-1 gap-2">
                    ${itemsHTML}
                </div>
            </div>
        `;

        let allPages: any[] = [];
        let countPage = 0;

        let buildGridSequential = (entities: Entity[], itemsPerRow: number, rowsPerPage: number) => {
            let countIndex = 0;
            let currentRows: any[] = [];
            let currentRowItems: any[] = [];

            entities.forEach((entity, index) => {
                currentRowItems.push(getBestiaryTemplate(entity, index, (e) => this._controller.display_modal(e)));
                countIndex++;

                if (countIndex % itemsPerRow === 0 || index === entities.length - 1) {
                    currentRows.push(html`<div class="flex flex-row flex-nowrap">${currentRowItems}</div>`);
                    currentRowItems = [];
                }

                if (countIndex % (itemsPerRow * rowsPerPage) === 0 || index === entities.length - 1) {
                    allPages.push(getPageHTML(++countPage, currentRows));
                    currentRows = [];
                }
            });
        };

        let nonBoss = data.bestiary.filter((entity: Entity) => !entity.isBoss() && !entity.isSpecial());
        let boss = data.bestiary.filter((entity: Entity) => entity.isBoss() && !entity.isSpecial());

        buildGridSequential(nonBoss, 4, 4);
        buildGridSequential(boss, 2, 2);

        let fragmentHTML = html`
            <div class="flex flex-row flex-wrap flex-1 justify-center sm:justify-between gap-1 items-stretch">
                ${allPages}
            </div>
        `;

        render(fragmentHTML, wrapper!);
    }

    private populateStats(data: any): void {
        console.log(data)
        data.stats.forEach((value: number, key: string) => {
            let elements = this._stats.querySelector("span#" + key);
            if (!elements)
                return;

            elements.innerHTML = value.toString();            
        });
    }
}