import { SaveController } from "./Controllers/SaveController.js";
import { Save } from "./Models/Save.js";
import { SaveView } from "./Views/SaveView.js";

document.addEventListener("DOMContentLoaded", function () {
    let save = new Save("online.dat");
    let saveView = new SaveView();
    let saveController = new SaveController(save, saveView);
    save.load().then(() => {
        saveController.update();
    });
});