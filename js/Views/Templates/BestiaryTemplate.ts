import { html } from "lit-html";
import { Entity } from "../../Models/Entity";

export const getBestiaryTemplate = (entity: Entity, index: number, onClick: (entity: Entity) => void) => {
    let width = entity.isBoss() ? "w-24" : "w-16";
    let delay = (index % 20) * 20;
    let not_unlocked = !entity.isUnlocked();
    
    return html`
        <div class="items-center justify-center flex p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors animate-stagger" 
             style="animation-delay: ${delay}ms" 
             data-id="${entity.getId()}" 
             data-variant="${entity.getVariant()}"
             @click=${() => onClick(entity)}>
            <img loading="lazy" 
                 src="/assets/gfx/enemies/${entity.getName().replace(/ /g, "_")}.png" 
                 class="${width} pixelated drop-shadow-md ${not_unlocked ? "opacity-30" : ""}">
        </div>
    `;
};
