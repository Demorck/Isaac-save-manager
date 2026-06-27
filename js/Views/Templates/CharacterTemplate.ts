import { html } from "lit-html";
import { Characters } from "../../Models/Characters";
import { SaveController } from "../../Controllers/SaveController";
import { Constants } from "../../Helpers/Constants";
import { Versions } from "../../Helpers/Enums/Versions";
import { Difficulty } from "../../Helpers/Enums/Difficulty";
import { Marks } from "../../Helpers/Enums/Marks";

const getMarkTemplate = (charId: number, mark: number, difficulty: Difficulty, type: Versions, controller: SaveController) => {
    let folder = type === Versions.ONLINE ? "online_" : "";
    let difficultyStr = difficulty === 0 ? "normal" : Difficulty[difficulty].toLowerCase();
    
    return html`
        <div class="p-1 cursor-pointer hover:scale-110 transition-transform" 
             data-player="${charId}" 
             data-id="${mark}" 
             data-difficulty="${difficulty}" 
             data-type="${type}"
             @click=${() => controller.toggleMark(charId, mark, difficulty, type)}>
            <img loading="lazy" 
                 src="/assets/gfx/marks/${folder}${difficultyStr}/${Marks[mark]}.png" 
                 class="${difficulty === 0 ? "opacity-40 grayscale drop-shadow-none" : "drop-shadow-md"} w-8 h-8 pixelated">
        </div>
    `;
};

export const getCharacterTemplate = (character: Characters, controller: SaveController) => {
    let soloMarksTemplates: any[] = [];
    character.getSoloMarks().forEach((difficulty, index) => {
        soloMarksTemplates.push(getMarkTemplate(character.getID(), index, difficulty, Versions.REPENTANCE, controller));
    });

    let onlineContainer = html``;
    if (Constants.VERSION_LOADED === Versions.ONLINE) {
        let onlineMarksTemplates: any[] = [];
        character.getOnlineMarks().forEach((difficulty, index) => {
            onlineMarksTemplates.push(getMarkTemplate(character.getID(), index, difficulty, Versions.ONLINE, controller));
        });

        onlineContainer = html`
            <div class="flex flex-row items-center">
                ${onlineMarksTemplates}
            </div>
        `;
    }

    return html`
        <div class="p-3 flex flex-col sm:flex-row items-center justify-evenly rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md shadow-lg hover:bg-black/40 transition-colors w-full gap-4">
            <div class="relative w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl p-2 border border-white/5">
                <img loading="lazy" src="/assets/gfx/characters/${character.getName()}.png" style="filter: invert(100%)" class="drop-shadow-md">
            </div>
            <div class="flex flex-row items-center">
                ${soloMarksTemplates}
            </div>
            ${onlineContainer}
        </div>
    `;
};
