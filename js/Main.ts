import { SaveController } from "@/Controllers/SaveController";
import { Save } from "@/Models/Save";

document.addEventListener("DOMContentLoaded", function () {
    let save = new Save();
    let saveController = new SaveController(save);
});