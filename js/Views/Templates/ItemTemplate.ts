import { html } from "lit-html";
import { Item } from "@/Models/Item";
import { SaveController } from "@/Controllers/SaveController";
import {Utils} from "@/Helpers/Utils";

export const getItemTemplate = (item: Item, index: number, controller: SaveController) => {
    if (item.getID() === -1) return html``;
    
    let delay = (index % 50) * 15;
    let itemNumber = Utils.numberWithLeadingZeros(item.getID());
    return html`
        <div class="p-1 sm:p-2 cursor-pointer hover:bg-white/10 rounded overflow-hidden flex justify-center items-center transition-colors animate-stagger" 
             style="animation-delay: ${delay}ms" 
             data-id="${item.getID()}"
             @click=${() => controller.toggleItem(item.getID(), item.isSeen())}>
            <img loading="lazy" 
                 src="/assets/gfx/items/collectibles/${itemNumber}.png" 
                 class="object-cover w-10 h-10 sm:w-16 sm:h-16 pixelated transition-all duration-300 ${!item.isSeen() ? "grayscale opacity-50" : "drop-shadow-md"}">
        </div>
    `;
};
