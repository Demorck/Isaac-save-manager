import { html } from "lit-html";
import { Achievement } from "../../Models/Achievement";
import { SaveController } from "../../Controllers/SaveController";

export const getAchievementTemplate = (achievement: Achievement, index: number, controller: SaveController) => {
    let delay = (index % 50) * 15;
    
    return html`
        <div class="p-2 bg-black/20 hover:bg-white/10 border border-white/5 rounded-2xl achievements cursor-pointer transition-all hover:scale-105 shadow-md flex items-center justify-center animate-stagger" 
             style="animation-delay: ${delay}ms" 
             data-id="${achievement.getID()}" 
             data-unlocked="${achievement.unlocked}"
             @click=${() => controller.toggleAchievement(achievement.getID(), achievement.unlocked)}>
            <img loading="lazy" 
                 src="/assets/gfx/achievements/${achievement.getID()}.png" 
                 class="${!achievement.unlocked ? "grayscale opacity-50 " : "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] "}w-16 h-16 pixelated transition-all">
        </div>
    `;
};
