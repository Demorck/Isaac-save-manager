import { html } from "lit-html";
import { Challenge } from "../../Models/Challenge";
import { SaveController } from "../../Controllers/SaveController";

export const getChallengeTemplate = (challenge: Challenge, index: number, controller: SaveController) => {
    let done = challenge.isDone();
    let classList = done ? "line-through text-gray-500 bg-black/40 border-transparent shadow-none" : "text-gray-200 bg-white/5 hover:bg-white/10 hover:shadow-lg border border-white/10 hover:-translate-y-0.5";

    return html`
        <div class="p-2 mb-2 rounded-xl text-sm font-bold text-center cursor-pointer transition-all ${classList}" 
             data-id="${challenge.getID()}" 
             data-done="${done}"
             @click=${() => controller.toggleChallenge(challenge.getID(), done)}>
            ${challenge.getName()}
        </div>
    `;
};
