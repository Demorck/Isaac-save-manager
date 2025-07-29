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
        let wrapper = this._items.querySelector(".wrapper");
        wrapper!.innerHTML = "";
        console.log(data.items);
        
        let count = 0;
        let currentRow = document.createElement("div");
        currentRow.classList.add("flex", "flex-row", "flex-wrap", "sm:flex-nowrap");

        let getNewPage = (countPage: number) => {
            let currentPage = document.createElement("div");
            currentPage.classList.add("flex", "flex-1", "border", "flex-col", "rounded-3xl", "flex-wrap", "gap-1", "items-center");
            let title = document.createElement("h2");
            title.classList.add("text-2xl", "font-[upheaval]");
            title.innerHTML = "Page " + countPage;
            currentPage.appendChild(title);
            return currentPage;
        };

        let getItemElement = (item: Item) => {
            let itemElement = document.createElement("div");
            itemElement.classList.add("sm:flex-1", "rounded", "p-1", "cursor-pointer");
            let image = document.createElement("img");
            image.loading = "lazy";
            image.src = "/assets/gfx/items/collectibles/" + Utils.numberWithLeadingZeros(item.getID()) + ".png";
            if (!item.isSeen()) {
                image.classList.add("grayscale", "opacity-80");
                itemElement.dataset.seen = "false";
            } else {
                itemElement.dataset.seen = "true";
            }
            image.classList.add("w-16", "pixelated");
            itemElement.appendChild(image);

            itemElement.addEventListener("click", () => {
                this._controller.toggleItem(item.getID(), itemElement.dataset.seen == "true");
            });

            return itemElement;
        }

        let countPage = 1;        
        let currentPage = getNewPage(countPage);
        data.items.forEach((item: Item) => {
            if (item.getID() <= 0)
                return;

            let itemElement = getItemElement(item);
            currentRow?.appendChild(itemElement);

            count++;

            if (count % 20 == 0) {
                currentPage?.appendChild(currentRow);
                currentRow = document.createElement("div");
                currentRow.classList.add("flex", "flex-row", "flex-wrap", "sm:flex-nowrap");
            }

            if (count % 120 == 0) {
                wrapper?.appendChild(currentPage);
                currentPage = getNewPage(++countPage);

            }
        });

        currentPage?.appendChild(currentRow);
        wrapper?.appendChild(currentPage);
    }

    private populateCharacters(data: any): void {
        let wrapper = this._mark.querySelector(".wrapper");
        wrapper!.innerHTML = "";

        let getMarkElement = (charId: number, mark: number, difficulty: number, type: Versions) => {
            let dom  = 
            `<div class="p-1 cursor-pointer" data-player="${charId}" data-id="${mark}" data-difficulty="${difficulty}" data-type="${type}">
                <img loading="lazy" src="/assets/gfx/marks/${(type == Versions.ONLINE ? "online_" : "")}${(difficulty == 0 ? "normal" : Difficulty[difficulty].toLowerCase())}/${Marks[mark]}.png" class="${difficulty == 0 ? "invert " : ""}w-8 h-8 pixelated">
            </div>`;
                        
            return Utils.htmlToElement(dom);
        }

        let getCharacterElement = (character: Characters) => {
            let char = `
            <div class="p-1 flex flex-col sm:flex-row items-center justify-evenly rounded-3xl border">
                <img loading="lazy"  src="/assets/gfx/characters/${character.getName()}.png" style="filter: invert(100%)">
            </div>`;
            let characterElement = Utils.htmlToElement(char);
            // characterElement.querySelector("img")?.addEventListener("click", () => {
            //     this._controller.toggleCharacterMark(character.getID());
            // })

            let soloMarks = character.getSoloMarks();
            let soloContainer = document.createElement("div");
            soloContainer.classList.add("flex", "flex-row", "items-center");
            soloMarks.forEach((difficulty, index) => {
                let markElement = getMarkElement(character.getID(), index, difficulty, Versions.REPENTANCE);
                markElement.addEventListener("click", () => {
                    this._controller.toggleMark(character.getID(), parseInt(markElement.dataset.id!), parseInt(markElement.dataset.difficulty!), parseInt(markElement.dataset.type!));
                });

                soloContainer.appendChild(markElement);
                characterElement.appendChild(soloContainer);
            });

            if (Constants.VERSION_LOADED == Versions.ONLINE) {
                let onlineMarks = character.getOnlineMarks();
                let onlineContainer = document.createElement("div");
                onlineContainer.classList.add("flex", "flex-row", "items-center");
                onlineMarks.forEach((difficulty, index) => {
                    let markElement = getMarkElement(character.getID(), index, difficulty, Versions.ONLINE);
                    markElement.addEventListener("click", () => {
                        this._controller.toggleMark(character.getID(), parseInt(markElement.dataset.id!), parseInt(markElement.dataset.difficulty!), parseInt(markElement.dataset.type!));
                    });

                    onlineContainer.appendChild(markElement);
                    characterElement.appendChild(onlineContainer);
                });
            }

            return characterElement;
        }

        data.characters.forEach((character: Characters) => {
            let characterElement = getCharacterElement(character);
            wrapper?.appendChild(characterElement);
        });
    }

    private populateAchievements(data: any): void {    
        let wrapper = this._achievements.querySelector(".wrapper");
        wrapper!.innerHTML = "";   

        let fragment = document.createDocumentFragment();

        let getAchievementElement = (achievement: Achievement) => {
            let dom = `<div class="p-1 achievements cursor-pointer" data-id="${achievement.getID()}" data-unlocked="${achievement.unlocked}">
                            <img loading="lazy" src="/assets/gfx/achievements/${achievement.getID()}.png" class="${!achievement.unlocked ? "grayscale opacity-80 " : ""}w-16 h-16 pixelated">
                        </div>`;
            return Utils.htmlToElement(dom);
        }

        data.achievements.forEach((achievement: Achievement) => {
            let achievementElement = getAchievementElement(achievement);
            achievementElement.addEventListener("click", () => {
                this._controller.toggleAchievement(achievement.getID(), achievement.unlocked);
            });
            fragment.appendChild(achievementElement);
        });
    
        wrapper?.appendChild(fragment);
    }

    private populateChallenges(data: any): void {
        let wrapper = this._challenges.querySelector(".wrapper");
        wrapper!.innerHTML = "";

        let challengeElement = (challenge: Challenge) => {
            let dom = `<div class="p-1 text-l text-center cursor-pointer ${challenge.isDone() ? "line-through" : ""}" data-id="${challenge.getID()}" data-done="${challenge.isDone()}">
                            ${challenge.getName()}
                        </div>`;
            return Utils.htmlToElement(dom);
        }

        let dlcELement = (dlc: Versions) => {
            let string: string;
            let color: string;
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
                default:
                    string = "Undefined";
                    color = "text-gray-500";
                    break;
            }

            let dom = `<div class="p-1 flex flex-col items-center rounded-3xl border sm:w-1/5" data-dlc="${dlc}">
                            <h1 class="text-2xl font-bold font-[upheaval] ${color}">${string}</h1>
                        </div><hr>`;
            return Utils.htmlToElement(dom);
        }
        
        let fragment = document.createElement("div");
        fragment.classList.add("flex", "sm:flex-row", "justify-between", "gap-1", "flex-col");

        let currentVersionID = Constants.VERSION_LOADED >= Versions.REPENTANCE ? Versions.REPENTANCE : Constants.VERSION_LOADED; // ?
        let arrayElementDLC: HTMLElement[] = [];
        for (let i = 1; i <= currentVersionID; i++) {
            let dlc = dlcELement(i);
            arrayElementDLC.push(dlc);
        }

        let j = 0;
        let max = Constants.CHALLENGES_ARRAY_DLC[j];
        data.challenges.forEach((challenge: Challenge, index: number) => {
            
            let element = challengeElement(challenge);
            element.addEventListener("click", () => {
                this._controller.toggleChallenge(challenge.getID(), challenge.isDone());
            });
            // console.log(j, index, max);
            arrayElementDLC[j].appendChild(element);
            

            if (index == max - 1)
            {
                fragment.appendChild(arrayElementDLC[j]);
                j++;
                max += Constants.CHALLENGES_ARRAY_DLC[j];
            }
        });

        wrapper?.appendChild(fragment);
    }

    private populateBestiary(data: any): void {
        let wrapper = this._bestiary.querySelector(".wrapper");
        wrapper!.innerHTML = "";       
        
        let fragment = document.createElement("div");
        fragment.classList.add("flex", "flex-row", "flex-wrap", "flex-1", "justify-center", "sm:justify-between", "gap-1", "items-stretch");
        let currentRow = document.createElement("div");
        currentRow.classList.add("flex", "flex-row", "flex-nowrap", "items-stretch");

        let wrapper_row = document.createElement("div");
        wrapper_row.classList.add("flex", "flex-col", "flex-nowrap", "items-stretch", "justify-evenly", "flex-1");

        let getPageElement = (index: number) => {
            let dom = `<div class="flex flex-col rounded-3xl border flex-wrap sm:w-1/5 items-center gap-1 p-2">
                            <h1 class="text-2xl">Page ${index}</h1>
                        </div>`;
            return Utils.htmlToElement(dom);
        }

        let getEntityElement = (entity: Entity): HTMLElement => {
            let width = "w-16";
            if (entity.isBoss())
                width = "w-24";
            let dom = `<div class="items-center flex p-1 cursor-pointer" data-id="${entity.getId()}" data-variant="${entity.getVariant()}">
                            <img loading="lazy" src="/assets/gfx/enemies/${entity.getName().replace(/ /g, "_")}.png" class="${width} pixelated">
                            </div>`;

            return Utils.htmlToElement(dom);
        }

        let event = (entity: Entity) => {
            this._controller.display_modal(entity);
        }

        let count = 0;
        let countPage = 0;
        let currentPage = getPageElement(++countPage);

        let nonBoss = data.bestiary.filter((entity: Entity) => !entity.isBoss() && !entity.isSpecial());
        let boss = data.bestiary.filter((entity: Entity) => entity.isBoss() && !entity.isSpecial());


        nonBoss.forEach((entity: Entity, index: number) => {
            let entityElement = getEntityElement(entity);
            entityElement.addEventListener("click", () => event(entity));
            currentRow.appendChild(entityElement);

            count++;

            if ((count) % 4 == 0) {
                wrapper_row.appendChild(currentRow);
                currentPage?.appendChild(wrapper_row);
                currentRow = document.createElement("div");
                currentRow.classList.add("flex", "flex-row", "flex-nowrap");
            }

            if ((count) % 16 == 0) {
                fragment?.appendChild(currentPage);
                currentPage = getPageElement(++countPage);
                wrapper_row = document.createElement("div");
                wrapper_row.classList.add("flex", "flex-col", "flex-nowrap", "items-stretch", "justify-evenly", "flex-1");
            }
        });

        boss.forEach((entity: Entity, index: number) => {
            let entityElement = getEntityElement(entity);
            entityElement.addEventListener("click", () => event(entity));
            currentRow.appendChild(entityElement);

            count++;

            if ((count) % 2 == 0) {
                wrapper_row.appendChild(currentRow);
                currentPage?.appendChild(wrapper_row);
                currentRow = document.createElement("div");
                currentRow.classList.add("flex", "flex-row", "flex-nowrap");
            }

            if ((count) % 4 == 0) {
                fragment?.appendChild(currentPage);
                currentPage = getPageElement(++countPage);
                wrapper_row = document.createElement("div");
                wrapper_row.classList.add("flex", "flex-col", "flex-nowrap", "items-stretch", "justify-evenly", "flex-1");
            }
        });

        wrapper?.appendChild(fragment);
    }

    private populateStats(data: any): void { 
        data.stats.forEach((value: number, key: string) => {
            let elements = this._stats.querySelector("span#" + key);
            
            if (!elements)
                return;

            elements.innerHTML = value.toString();            
        });
    }
}