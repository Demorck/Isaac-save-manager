import { SaveController } from "@/Controllers/SaveController";
import { Save } from "@/Models/Save";
import { SaveView } from "@/Views/SaveView";

document.addEventListener("DOMContentLoaded", function () {
    let save = new Save();
    let saveController = new SaveController(save);
});