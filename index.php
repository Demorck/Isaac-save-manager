<?php
// include/helpers/helper.php

function getAssetPath($name) {
    $manifestPath = __DIR__ . '/dist/manifest.json';
    if (file_exists($manifestPath)) {
        $manifest = json_decode(file_get_contents($manifestPath), true);
        return ($manifest[$name] ?? $name);   
    }

    echo 'No manifest file found';
    echo $manifestPath;
    return '/dist/' . $name;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="The Binding of Isaac: Repentance and Repentance + Save Editor - Unlock achievements, marks, items, challenges, bestiary and more.">
    <title>The Binding of Isaac : Repentance - Save Editor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div id="loading" class="hidden">
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div class="bg-white p-4 rounded-lg">
                <h2 class="text-2xl font-bold text-black">Loading...</h2>
            </div>
        </div>
    </div>

    <div id="modal-bestiary"
         class="hidden fixed inset-0 z-50 items-center justify-center bg-black/50"
         data-enemy-id="" data-enemy-variant="">

        <div class="z-50 m-0 sticky top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0 p-6 rounded-3xl shadow-lg bg-[#555] border max-w-md w-full">
            <div class="flex flex-col">
                <div class="flex flex-row flex-1 gap-4 items-center justify-center">
                    <img loading="lazy" src="" class="mb-4 w-16">
                    <h2 class="text-2xl font-bold mb-4 text-[upheaval] text-black text-white" id="modal-enemy-name">BIOBAK</h2>
                    <img loading="lazy" src="" class="mb-4 w-16">
                </div>
                <p class="mb-2 text-black text-white">Kills: <input class="text-black" id="modal-enemy-kills" type="number" min="0" max="2147483647"></p>
                <p class="mb-2 text-black text-white">Deaths: <input class="text-black" id="modal-enemy-deaths" type="number" min="0" max="2147483647"></p>
                <p class="mb-2 text-black text-white">Hits: <input class="text-black" id="modal-enemy-hits" type="number" min="0" max="2147483647"></p>
                <p class="mb-4 text-black text-white">Encounters: <input class="text-black" id="modal-enemy-encounters" type="number" min="0" max="2147483647"></p>
                <div class="flex flex-row justify-evenly items-center">
                    <button id="modal-save-changes"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                       Save changes
                    </button>
                    <button id="close-modal"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>




    <div class="min-h-screen flex flex-col">
        <!-- Navigation Tabs -->
        <div class="bg-[#555] shadow">
            <div class="container mx-auto">
                <!-- Mobile Menu Button -->
                <div class="sm:hidden flex justify-between items-center py-4 px-6">
                    <span class="text-white font-bold">Menu</span>
                    <button id="hamburger-button" class="text-white focus:outline-none">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>

                <!-- Mobile Navigation -->
                <div id="mobile-menu" class="hidden flex-col space-y-2 py-4 px-6 bg-[#444] sm:hidden">
                    <button class="tab-button text-white hover:bg-[#333] py-2 px-4 focus:outline-none" id="tab-menu">Home</button>
                    <button class="tab-button text-white hover:bg-[#333] py-2 px-4 focus:outline-none hidden" id="tab-achievements">Achievements</button>
                    <button class="tab-button text-white hover:bg-[#333] py-2 px-4 focus:outline-none hidden" id="tab-marks">Marks</button>
                    <button class="tab-button text-white hover:bg-[#333] py-2 px-4 focus:outline-none hidden" id="tab-items">Items</button>
                    <button class="tab-button text-white hover:bg-[#333] py-2 px-4 focus:outline-none hidden" id="tab-challenges">Challenges</button>
                    <button class="tab-button text-white hover:bg-[#333] py-2 px-4 focus:outline-none hidden" id="tab-bestiary">Bestiary</button>
                    <button class="tab-button text-white hover:bg-[#333] py-2 px-4 focus:outline-none hidden" id="tab-others">Others</button>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden sm:flex space-x-4  px-6">
                    <button class="tab-button px-6 py-4 text-white hover:bg-[#444] focus:outline-none" id="tab-menu">Home</button>
                    <button class="tab-button px-6 py-4 text-white hover:bg-[#444] focus:outline-none hidden" id="tab-achievements">Achievements</button>
                    <button class="tab-button px-6 py-4 text-white hover:bg-[#444] focus:outline-none hidden" id="tab-marks">Marks</button>
                    <button class="tab-button px-6 py-4 text-white hover:bg-[#444] focus:outline-none hidden" id="tab-items">Items</button>
                    <button class="tab-button px-6 py-4 text-white hover:bg-[#444] focus:outline-none hidden" id="tab-challenges">Challenges</button>
                    <button class="tab-button px-6 py-4 text-white hover:bg-[#444] focus:outline-none hidden" id="tab-bestiary">Bestiary</button>
                    <button class="tab-button px-6 py-4 text-white hover:bg-[#444] focus:outline-none hidden" id="tab-others">Others</button>
                </div>
            </div>
        </div>
                
        <!-- Tab Content -->
        <div class="flex-grow container mx-auto p-4">
            <div id="content-menu" class="tab-content hidden">
                <h2 class="text-4xl mb-4 font-[upheaval]">The Binding of Isaac: Repentance (and Repentance+) - Save Editor</h2>
                <div class="wrapper flex flex-wrap flex-col gap-5">
                    <div class="flex flex-row">
                        <label for="upload-button" class="border-2 border-solid border-gray-300 rounded-lg p-4 me-4 bg-blue-900 cursor-pointer hover:bg-blue-800 uppercase">
                            <input id="upload-button" type="file" class="hidden" accept=".dat">
                            Load save file
                        </label>
                        <label for="download-button" class="border-2 border-solid border-gray-300 rounded-lg p-4 me-4 bg-blue-900 cursor-pointer hover:bg-blue-800 uppercase hidden">
                            <button id="download-button"></button>
                            Export save file
                        </label>
                        <label for="convert-button" class="border-2 border-solid border-gray-300 rounded-lg p-4 me-4 bg-blue-900 cursor-pointer hover:bg-blue-800 uppercase hidden">
                            <button id="convert-button"></button>
                            Convert to Repentance
                        </label>

                        <div class="error flex items-center font-extrabold text-red-500 hidden">

                        </div>
                    </div>
                    <div class="flex-1 w-full border-2 border-solid border-gray-300 rounded-lg p-4 bg-blue-900">
                        <h3 class="text-2xl font-bold mb-4">Remember to always make a backup.</h3>
                        <p class="">Save local data are located:
                            <ul class="list-disc list-inside">
                                <li>Windows: <code>&lt;Your Steam Directory&gt;/userdata/&lt;Your user id&gt;>/remote/250900/saves</code></li>
                                <li>Linux: <code>~/.local/share/Steam/steamapps/compatdata/250900/pfx/drive_c/users/steamuser/Documents/My Games/Binding of Isaac Repentance</code></li>
                            </ul>
                        </p>
                        When you load a save file, it will be stored in your browser's local storage. It will not be uploaded to any server. <br>
                        When you export a save file and past it in your save folder, you need to go to the stats screen in the game to apply the achievements changes.<br>
                        If you have any issue, please report it via my X account: <a href="https://x.com/Demorck_" target="_blank" class="text-blue-300 hover:underline">Demorck_</a>.
                        <hr class="mt-4 mb-4">
                        <h3 class="text-2xl font-bold mb-4">How to modify the savefile ?</h3>
                        Just click in the tab you want to modify, then click on the button to unlock everything or individual things (like one achievement to disable/enable it, etc.) <br>
                        <hr class="mt-4 mb-4">
                        <h3 class="text-2xl font-bold mb-4">Ad free - Want to donate - Github</h3>
                        This website will be ad-free (unlike isaaconnect....), if you want to support me, you can donate on this patreon: <a class="text-red-200 underline" href="https://patreon.com/demorck" target="_blank">here</a> <br>
                        The code of this website is open source on my github: <a class="text-red-200 underline" href="https://github.com/Demorck/Isaac-save-manager" target="_blank">here</a> <br>
                    </div>
                    <div class="sm:flex-row flex-col flex gap-10">
                        <div class="flex-1 bg-red-900 border-2 border-solid border-gray-300 flex flex-col p-4 rounded-lg">
                            <h2 class="text-2xl font-[upheaval]">Functionalities</h2>
                            <ul class="list-disc list-inside">
                                <li>Unlock all achievements</li>
                                <li>Unlock all marks</li>
                                <li>See all items</li>
                                <li>Finish all challenges</li>
                                <li>See your bestiary and change it</li>
                            </ul>
                            <br>
                            <h2 class="text-2xl font-[upheaval]">Roadmap</h2>
                            <ul class="list-disc list-inside">
                                <li>Unlock sins</li>
                                <li>Unlock one thing instead of all</li>
                                <li>Unlock only characters ?</li>
                                <li>Change statistics</li>
                                <li>Change the UI</li>
                                <li>AB+ support</li>
                                <li>Feedback needed ! :) </li>
                            </ul>
                        </div>
                        <div class="flex-1 bg-red-900 border-2 border-solid border-gray-300 p-4 rounded-lg">
                            <h2 class="text-2xl font-[upheaval]">Statistics of your file</h2>
                            <ul id="content-stats" class="list-disc list-inside">
                                <li>Number of death: <span id="deaths">0</span></li>
                                <li>Mom's Kills: <span id="mom-kills">0</span></li>
                                <li>Number of rocks broken: <span id="broken-rocks">0</span></li>
                                <li>Shopkeeper kills: <span id="shopkeeper-kills">0</span></li>
                                <li>Coin in donation machine: <span id="donation-coins">0</span></li>
                                <li>More is coming...</li>
                            </ul>
                        </div>
                    </div>
                    <div class="">
                        Isaac save editor is an independent project and is not sponsored by, affiliated with or related to the creators or publishers of The Binding of Isaac.<br>
                        Found how the save file works by projects on github except bestiary, sins, statistics and some others stuffs that I need to understand by myself.<br>
                        The sprites come from the wiki <a href="https://bindingofisaacrebirth.wiki.gg/" target="_blank" class="text-blue-300 hover:underline">here</a> (btw, don't go on fandom).<br>
                    </div>
                </div>
            </div>

            <div id="content-achievements" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4 mr-5">Achievements</h2>
                <button id="toggle-achievements" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Toggle all achievements</button>

                <div class="wrapper flex flex-wrap"></div>
            </div>
            <div id="content-marks" class="tab-content flex flex-col hidden">
                <div class="flex items-center">
                    <h2 class="text-2xl font-bold mb-4 mr-5">Marks</h2>
                    <button id="toggle-solo-marks" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Toggle all solo marks</button>
                    <button id="toggle-online-marks" class="hidden text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Toggle all online marks</button>
                </div>
                <div class="wrapper flex flex-wrap flex-col gap-4"></div>
            </div>
            <div id="content-items" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4">Items</h2>
                <button id="unlock-items" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">See all items</button>
                <div class="wrapper flex flex-col flex-wrap gap-4"></div>
            </div>
            <div id="content-challenges" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4">Challenges</h2>
                <div class="wrapper flex flex-wrap flex-col"></div>
            </div>
            
            <div id="content-bestiary" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4">Bestiary</h2>
                <button id="unlock-bestiary" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Unlock Bestiary (set encounter to 1 if the enemy is locked)</button>
                <div class="wrapper flex flex-wrap flex-col"></div>
            </div>

            <div id="content-others" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4">Others</h2>
                <button id="unlock-sins" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sins</button>
                    <div class="wrapper flex flex-wrap flex-col"></div>
            </div>
        </div>
    </div>

    <script>
        document.getElementById('hamburger-button').addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenu.classList.toggle('hidden');
        });
    </script>
    <script type="module" src="<?= getAssetPath("main.js") ?>"></script>
</body>
</html>