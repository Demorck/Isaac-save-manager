import { Constants } from "@/Helpers/Constants";
import { Difficulty } from "@/Helpers/Enums/Difficulty";
import { Versions } from "@/Helpers/Enums/Versions";
import { Save } from "@/Models/Save";
import { SaveView } from "@/Views/SaveView";

export class SaveController {
    private _save: Save;
    private _saveView: SaveView;

    private _toggleSoloMarks: HTMLButtonElement;
    private _toggleOnlineMarks: HTMLButtonElement;
    private _currentDifficulty: Difficulty;

    private _toggleAchievements: HTMLButtonElement;
    private _currentToggle: boolean;

    private _unlockItems: HTMLButtonElement;
    private _currentToggleItems: boolean;

    private _unlockBestiary: HTMLButtonElement;

    private _sins: HTMLButtonElement

    private _downloadButton: HTMLButtonElement;
    private _uploadButton: HTMLInputElement;

    constructor(save: Save)
    {
        this._save = save;
        this._saveView = new SaveView(this);
        this._currentDifficulty = Difficulty.HARD;
        this._currentToggle = true;

        this._toggleSoloMarks = document.getElementById("toggle-solo-marks") as HTMLButtonElement;
        this._toggleOnlineMarks = document.getElementById("toggle-online-marks") as HTMLButtonElement;
        this._toggleAchievements = document.getElementById("toggle-achievements") as HTMLButtonElement;
        this._unlockBestiary = document.getElementById("unlock-bestiary") as HTMLButtonElement;
        this._sins = document.getElementById("unlock-sins") as HTMLButtonElement;
        this._downloadButton = document.getElementById("download-button") as HTMLButtonElement;
        this._uploadButton = document.getElementById("upload-button") as HTMLInputElement;

        this._unlockItems = document.getElementById("unlock-items") as HTMLButtonElement;
        this._currentToggleItems = true;
        
        save.addObserver(this._saveView);
        this.addEventListeners();
    }

    public update() {
        if (Constants.VERSION_LOADED == Versions.ONLINE) {
            this._toggleOnlineMarks.classList.remove("hidden");
        }

        this.setupEventsForIndividuals(); 

        document.querySelector('label[for="download-button"]')?.classList.remove("hidden");
    }

    private addEventListeners(): void {
        this._toggleSoloMarks.addEventListener("click", () => {
            this._save.toggleSoloMarks(this._currentDifficulty);
            this.cycleDifficulty();
        });

        this._toggleOnlineMarks.addEventListener("click", () => {
            this._save.toggleOnlineMarks(this._currentDifficulty);
            this.cycleDifficulty();
        });

        this._toggleAchievements.addEventListener("click", () => {
            this._save.toggleAchievements(this._currentToggle);
            this.cycleToggle();
        });

        this._unlockBestiary.addEventListener("click", () => {
            this._save.unlockBestiary();
        });

        this._sins.addEventListener("click", () => {
            this._save.unlockSins();
        });

        this._unlockItems.addEventListener("click", () => {
            this._save.toggleItems(this._currentToggleItems);
            this._currentToggleItems = !this._currentToggleItems;
        })

        this._downloadButton.addEventListener("click", () => {
            let data = this._save.data;
            this.downloadFile(data, "save.dat");
        });

        this._uploadButton.addEventListener("change", (event) => {
            this.uploadData(event);
        });

        

        const tabs = document.querySelectorAll('.tab-button') as NodeListOf<HTMLElement>;
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const targetId = tab.id.replace('tab', 'content');
                const targetContent = document.getElementById(targetId);

                // Gestion de l'apparence des onglets
                tabs.forEach(t => t.classList.remove('text-white', 'border-b-2', 'border-white'));
                tab.classList.add('text-white', 'border-b-2', 'border-white');

                // Affichage/Masquage des contenus
                contents.forEach(content => content.classList.add('hidden'));
                targetContent?.classList.remove('hidden');

                // Vérifier si le contenu a déjà été chargé
                if (targetContent && !targetContent.dataset.loaded) {
                    let tabName = targetId.replace('content-', '').toLowerCase();
                    this._save.populateContent(tabName);
                    targetContent.dataset.loaded = 'true'; // Marquez comme chargé
                }

                // Fermer le menu mobile si nécessaire
                if (window.innerWidth < 640) {
                    document.getElementById('mobile-menu')?.classList.add('hidden');
                }
            });
        });

        // Initialisation : Cliquez sur le premier onglet
        tabs[0].click();
    }

    private setupEventsForIndividuals(): void {
        let achievements = document.querySelectorAll('.achievements') as NodeListOf<HTMLElement>;
        achievements.forEach((achievement: HTMLElement) => {
            achievement.addEventListener("click", () => {
                let unlocked = achievement.dataset.unlocked == "true";
                this._save.toggleAchievement(parseInt(achievement.dataset.id!), unlocked);
                console.log(achievement.dataset.id);
                
            });
        });
        
    }

    private cycleDifficulty(): void {
        this._currentDifficulty = (this._currentDifficulty + 1) % Constants.NUMBER_OF_DIFFICULTY;
    }

    private cycleToggle(): void {
        this._currentToggle = !this._currentToggle;
    }
    
    private downloadFile(data: Uint8Array, filename: string) {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    private displayMenus() {
        document.querySelectorAll('[id^="tab"]').forEach((element) => {
            element.classList.remove("hidden");
        });
    }

    private uploadData(event: Event) {
        let target = event.target as HTMLInputElement;
        let file = target.files![0];
        let reader = new FileReader();
        reader.onload = (event) => {
            let result = event.target!.result as ArrayBuffer;
            let data = new Uint8Array(result);
            this._save.update(data).then(() => {
                this.displayMenus();
            });
        };
        reader.readAsArrayBuffer(file);

        this.update();
    }

    public toggleAchievement(id: number, unlocked: boolean): void {
        this._save.toggleAchievement(id, !unlocked);
    }

    public toggleMark(charId: number, markId: number, difficulty: Difficulty, type: Versions): void {
        let newDifficulty = (difficulty + 1) % 3;
        this._save.toggleMark(charId, markId, newDifficulty, type);
    }

    public toggleItem(id: number, unlocked: boolean): void {
        this._save.toggleItem(id, !unlocked);
    }

    public toggleChallenge(id: number, unlocked: boolean): void {
        this._save.toggleChallenge(id, !unlocked);
    }
}