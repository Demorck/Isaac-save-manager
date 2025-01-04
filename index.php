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
    <title>TBOI Save Editor</title>
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
                    </div>
                    <div class="flex-1 w-full border-2 border-solid border-gray-300 rounded-lg p-4 bg-blue-900">
                        <h3 class="text-2xl font-bold mb-4">Remember to always make a backup.</h3>
                        <p class="">Save local data are located:
                            <ul class="list-disc list-inside">
                                <li>Windows: <code>&lt;Your Steam Directory&gt;/userdata/&lt;Your user id&gt;>/remote/250900/saves</code></li>
                                <li>Linux: <code>?</code></li>
                                <li>Mac: <code>?</code></li>
                            </ul>
                        </p>
                        When you load a save file, it will be stored in your browser's local storage. It will not be uploaded to any server. <br>
                        When you export a save file and past it in your save folder, you need to go to the stats screen in the game to apply the achievements changes.<br>
                        If you have any issue, please report it via my X account: <a href="https://x.com/Demorck_" target="_blank" class="text-blue-300 hover:underline">Demorck_</a>.
                    </div>
                    <div class="sm:flex-row flex-col flex gap-10">
                        <div class="flex-1 bg-red-900 flex flex-col p-4 rounded-lg">
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
                            </ul>
                        </div>
                        <div class="flex-1 bg-red-900 p-4 rounded-lg">
                            <h2 class="text-2xl font-[upheaval]">Statistics of your file</h2>
                            <ul id="content-stats" class="list-disc list-inside">
                                <li>Number of death: <span id="deaths">0</span></li>
                                <li>Mom's Kills: <span id="mom-kills">0</span></li>
                            </ul>
                        </div>
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
                <div class="wrapper flex flex-col flex-wrap gap-4"></div>
            </div>
            <div id="content-challenges" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4">Challenges</h2>
                <div class="wrapper flex flex-wrap flex-col"></div>
            </div>
            
            <div id="content-bestiary" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4">Bestiary</h2>
                <button id="unlock-bestiary" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Débloquer le bestiaire (1 partout)</button>
                <div class="wrapper flex flex-wrap flex-col"></div>
            </div>

            <div id="content-others" class="tab-content hidden">
                <h2 class="text-2xl font-bold mb-4">Others</h2>
                <button id="unlock-sins" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Sins</button>
                <!-- <div class="wrapper flex flex-wrap flex-col"></div> -->
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