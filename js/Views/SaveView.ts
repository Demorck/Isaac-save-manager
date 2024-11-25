import { Constants } from "../Helpers/Constants.js";
import { Difficulty } from "../Helpers/Enums/Difficulty.js";
import { Marks } from "../Helpers/Enums/Marks.js";
import { Versions } from "../Helpers/Enums/Versions.js";
import { Utils } from "../Helpers/Utils.js";
import { Achievement } from "../Models/Achievement.js";
import { Challenge } from "../Models/Challenge.js";
import { Characters } from "../Models/Characters.js";
import { Item } from "../Models/Item.js";
import { Observer } from "./Observer.js";

export class SaveView implements Observer {
    private _achievements: HTMLElement;
    private _mark: HTMLElement;
    private _challenges: HTMLElement;
    private _items: HTMLElement;

    constructor() {
        this._achievements = document.getElementById("content-achievements")!;
        this._mark = document.getElementById("content-marks")!;
        this._items = document.getElementById("content-items")!;
        this._challenges = document.getElementById("content-challenges")!;
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
    }

    private populateItems(data: any) {
        let wrapper = this._items.querySelector(".wrapper");
        wrapper!.innerHTML = "";
        data.items.forEach((item: Item) => {
            let itemElement = document.createElement("div");
            itemElement.classList.add("p-1");
            let image = document.createElement("img");
            image.src = "/assets/gfx/items/collectibles/" + Utils.numberWithLeadingZeros(item.getID()) + ".png";
            if (!item.isSeen()) {
                image.classList.add("grayscale", "opacity-80");
            }
            image.classList.add("w-8", "pixelated");
            itemElement.appendChild(image);
            wrapper?.appendChild(itemElement);
        });
    }

    private populateCharacters(data: any): void {
        let wrapper = this._mark.querySelector(".wrapper");
        wrapper!.innerHTML = "";
        data.characters.forEach((character: Characters) => {
            let characterElement = document.createElement("div");
            characterElement.classList.add("p-1", "flex", "flex-row", "items-center", "justify-evenly");
            let image = document.createElement("img");
            image.src = "/assets/gfx/characters/" + character.getName() + ".png";
            characterElement.appendChild(image);

            let soloMarks = character.getSoloMarks();
            let soloContainer = document.createElement("div");
            soloContainer.classList.add("flex", "flex-row", "items-center");
            soloMarks.forEach((difficulty, index) => {
                let markElement = document.createElement("div");
                markElement.classList.add("p-1");
                let markImage = document.createElement("img");
                let stringDifficulty = (difficulty == 0 ? "Normal" : Difficulty[difficulty]);
                if (stringDifficulty == undefined)
                {
                    console.log(difficulty, Marks[index], character);
                    
                    
                }
                markImage.src = "/assets/gfx/marks/" + stringDifficulty + "/" + Marks[index] + ".png";
                markImage.classList.add("w-8", "h-8", "pixelated");
                if (difficulty == 0)
                    markImage.classList.add("grayscale", "opacity-10");
                markElement.appendChild(markImage);
                soloContainer.appendChild(markElement);
                
                characterElement.appendChild(soloContainer);
            });

            if (Constants.VERSION_LOADED == Versions.ONLINE) {
                let onlineMarks = character.getOnlineMarks();
                let onlineContainer = document.createElement("div");
                onlineContainer.classList.add("flex", "flex-row", "items-center");
                onlineMarks.forEach((difficulty, index) => {
                    let markElement = document.createElement("div");
                    markElement.classList.add("p-1");
                    let markImage = document.createElement("img");
                    let stringDifficulty = (difficulty == 0 ? "Normal" : Difficulty[difficulty]);
                    if (stringDifficulty == undefined)
                    {
                        console.log(difficulty, Marks[index], character);
                        
                        
                    }
                    markImage.src = "/assets/gfx/marks/online_" + stringDifficulty + "/" + Marks[index] + ".png";
                    markImage.classList.add("w-8", "h-8", "pixelated");
                    if (difficulty == 0)
                        markImage.classList.add("grayscale", "opacity-10");
                    markElement.appendChild(markImage);
                    onlineContainer.appendChild(markElement);
                    
                    characterElement.appendChild(onlineContainer);
                });
            }

            wrapper?.appendChild(characterElement);
        });
    }

    private populateAchievements(data: any): void {    
        let wrapper = this._achievements.querySelector(".wrapper");
        wrapper!.innerHTML = "";   
        data.achievements.forEach((achievement: Achievement) => {
            
            let achievementElement = document.createElement("div");
            achievementElement.classList.add("p-1");
            let image = document.createElement("img");
            image.src = "/assets/gfx/achievements/" + achievement.getID() + ".png";
            if (!achievement.unlocked) {
                image.classList.add("grayscale", "opacity-80");
            }
            achievementElement.appendChild(image);
            wrapper?.appendChild(achievementElement);
        });
    }

    private populateChallenges(data: any): void {
        let wrapper = this._challenges.querySelector(".wrapper");
        wrapper!.innerHTML = "";
        data.challenges.forEach((challenge: Challenge) => {
            let challengeElement = document.createElement("div");
            challengeElement.classList.add("p-1");
            challengeElement.innerHTML = challenge.getName();
            if (challenge.isDone())
                challengeElement.classList.add("line-through");
            wrapper?.appendChild(challengeElement);
        });
    }

    private populateBestiary(data: any): void {

    }
}