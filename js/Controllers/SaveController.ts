import { Constants } from "../Helpers/Constants";
import { Difficulty } from "../Helpers/Enums/Difficulty";
import { Versions } from "../Helpers/Enums/Versions";
import { Save } from "../Models/Save";
import { SaveView } from "../Views/SaveView";

export class SaveController {
    private _save: Save;
    private _saveView: SaveView;

    private _toggleSoloMarks: HTMLButtonElement;
    private _toggleOnlineMarks: HTMLButtonElement;
    private _currentDifficulty: Difficulty;

    private _toggleAchievements: HTMLButtonElement;
    private _currentToggle: boolean;


    private _downloadButton: HTMLButtonElement;
    private _uploadButton: HTMLInputElement;

    constructor(save: Save, saveView: SaveView)
    {
        this._save = save;
        this._saveView = saveView;
        this._currentDifficulty = Difficulty.HARD;
        this._currentToggle = true;

        this._toggleSoloMarks = document.getElementById("toggle-solo-marks") as HTMLButtonElement;
        this._toggleOnlineMarks = document.getElementById("toggle-online-marks") as HTMLButtonElement;
        this._toggleAchievements = document.getElementById("toggle-achievements") as HTMLButtonElement;
        this._downloadButton = document.getElementById("download-button") as HTMLButtonElement;
        this._uploadButton = document.getElementById("upload-button") as HTMLInputElement;
        
        save.addObserver(saveView);
        this.addEventListeners();
    }

    public update() {
        if (Constants.VERSION_LOADED == Versions.ONLINE) {
            this._toggleOnlineMarks.classList.remove("hidden");
        }
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

        this._downloadButton.addEventListener("click", () => {
            let data = this._save.data;
            this.downloadFile(data, "save.dat");
        });

        this._uploadButton.addEventListener("change", (event) => {
            this.uploadData(event);
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
    }
}