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
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              montserrat: ['Montserrat', 'sans-serif'],
              upheaval: ['Upheaval', 'sans-serif'],
              isaac: ['isaac-game', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <link rel="stylesheet" href="assets/css/style.css">
    <script>
        (function() {
            var t = localStorage.getItem('theme') || 'flat';
            document.documentElement.setAttribute('data-theme', t);
        })();
    </script>
</head>
<body class="font-montserrat">

    <!-- Background image -->
    <div class="fixed inset-0 z-[-1]">
        <img src="/assets/cellar.jpg" class="bg-img-overlay object-cover w-full h-full" alt="">
    </div>

    <!-- Loading overlay -->
    <div id="loading" class="hidden fixed inset-0 z-[100] modal-overlay flex justify-center items-center">
        <div class="modal-box p-8 rounded-xl flex flex-col items-center gap-4">
            <svg class="animate-spin h-9 w-9 color-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 class="text-xl font-upheaval tracking-wider">Loading...</h2>
        </div>
    </div>

    <!-- Bestiary modal -->
    <div id="modal-bestiary"
         class="hidden fixed inset-0 z-[90] flex items-center justify-center modal-overlay"
         data-enemy-id="" data-enemy-variant="">

        <div class="modal-box p-6 rounded-xl max-w-md w-full mx-4">
            <div class="flex flex-col gap-5">
                <div class="flex flex-row gap-4 items-center justify-center">
                    <img loading="lazy" src="" class="w-14 pixelated">
                    <h2 class="text-2xl font-upheaval tracking-widest page-title" id="modal-enemy-name">BIOBAK</h2>
                    <img loading="lazy" src="" class="w-14 pixelated">
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center card-inner p-3 rounded-lg">
                        <span class="font-semibold text-sm">Kills</span>
                        <input class="input-field w-24 text-right rounded px-2 py-1 text-sm" id="modal-enemy-kills" type="number" min="0" max="2147483647">
                    </div>
                    <div class="flex justify-between items-center card-inner p-3 rounded-lg">
                        <span class="font-semibold text-sm">Deaths</span>
                        <input class="input-field w-24 text-right rounded px-2 py-1 text-sm" id="modal-enemy-deaths" type="number" min="0" max="2147483647">
                    </div>
                    <div class="flex justify-between items-center card-inner p-3 rounded-lg">
                        <span class="font-semibold text-sm">Hits</span>
                        <input class="input-field w-24 text-right rounded px-2 py-1 text-sm" id="modal-enemy-hits" type="number" min="0" max="2147483647">
                    </div>
                    <div class="flex justify-between items-center card-inner p-3 rounded-lg">
                        <span class="font-semibold text-sm">Encounters</span>
                        <input class="input-field w-24 text-right rounded px-2 py-1 text-sm" id="modal-enemy-encounters" type="number" min="0" max="2147483647">
                    </div>
                </div>

                <div class="flex flex-row gap-3">
                    <button id="close-modal" class="btn-cancel flex-1 font-bold rounded-lg text-sm px-4 py-2.5">
                        Cancel
                    </button>
                    <button id="modal-save-changes" class="btn-primary flex-1 font-bold rounded-lg text-sm px-4 py-2.5">
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    </div>


    <div class="min-h-screen flex flex-col">
        <!-- Navigation -->
        <div class="sticky top-0 z-40 nav-bar">
            <div class="container mx-auto">
                <!-- Mobile header -->
                <div class="sm:hidden flex justify-between items-center py-3 px-5">
                    <span class="font-upheaval text-lg tracking-wider page-title">Menu</span>
                    <button id="hamburger-button" class="color-muted hover:color-text transition-colors focus:outline-none">
                        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>

                <!-- Mobile navigation -->
                <div id="mobile-menu" class="hidden flex-col space-y-1 py-3 px-4 mobile-menu-panel sm:hidden">
                    <button class="tab-button tab-btn w-full text-left font-bold text-sm py-2.5 px-4 rounded-lg focus:outline-none" id="tab-menu">Home</button>
                    <button class="tab-button tab-btn w-full text-left font-bold text-sm py-2.5 px-4 rounded-lg focus:outline-none hidden" id="tab-achievements">Achievements</button>
                    <button class="tab-button tab-btn w-full text-left font-bold text-sm py-2.5 px-4 rounded-lg focus:outline-none hidden" id="tab-marks">Marks</button>
                    <button class="tab-button tab-btn w-full text-left font-bold text-sm py-2.5 px-4 rounded-lg focus:outline-none hidden" id="tab-items">Items</button>
                    <button class="tab-button tab-btn w-full text-left font-bold text-sm py-2.5 px-4 rounded-lg focus:outline-none hidden" id="tab-challenges">Challenges</button>
                    <button class="tab-button tab-btn w-full text-left font-bold text-sm py-2.5 px-4 rounded-lg focus:outline-none hidden" id="tab-bestiary">Bestiary</button>
                    <button class="tab-button tab-btn w-full text-left font-bold text-sm py-2.5 px-4 rounded-lg focus:outline-none hidden" id="tab-others">Others</button>
                </div>

                <!-- Desktop navigation -->
                <div class="hidden sm:flex items-center px-6 overflow-x-auto no-scrollbar">
                    <button class="tab-button tab-btn px-5 py-4 font-bold text-sm tracking-wide uppercase focus:outline-none" id="tab-menu">Home</button>
                    <button class="tab-button tab-btn px-5 py-4 font-bold text-sm tracking-wide uppercase focus:outline-none hidden" id="tab-achievements">Achievements</button>
                    <button class="tab-button tab-btn px-5 py-4 font-bold text-sm tracking-wide uppercase focus:outline-none hidden" id="tab-marks">Marks</button>
                    <button class="tab-button tab-btn px-5 py-4 font-bold text-sm tracking-wide uppercase focus:outline-none hidden" id="tab-items">Items</button>
                    <button class="tab-button tab-btn px-5 py-4 font-bold text-sm tracking-wide uppercase focus:outline-none hidden" id="tab-challenges">Challenges</button>
                    <button class="tab-button tab-btn px-5 py-4 font-bold text-sm tracking-wide uppercase focus:outline-none hidden" id="tab-bestiary">Bestiary</button>
                    <button class="tab-button tab-btn px-5 py-4 font-bold text-sm tracking-wide uppercase focus:outline-none hidden" id="tab-others">Others</button>
                    <div class="ml-auto pl-4">
                        <button class="theme-switcher" id="theme-switcher-btn">Theme</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab content -->
        <div class="flex-grow container mx-auto p-4 md:p-8">

            <!-- Home -->
            <div id="content-menu" class="tab-content hidden animate-fade-in">
                <h2 class="text-4xl md:text-5xl mb-8 text-center font-upheaval page-title tracking-wide">
                    The Binding of Isaac: Repentance (and Repentance+)  Save Editor
                </h2>

                <div class="flex flex-col gap-8">
                    <div class="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
                        <label id="upload-label" for="upload-button" class="upload-label flex-1 sm:max-w-xs text-center rounded-xl p-6">
                            <input id="upload-button" type="file" class="hidden" accept=".dat">
                            <span class="block uppercase font-bold tracking-wider text-sm">Load save file</span>
                        </label>
                        <label for="download-button" class="hidden upload-label flex-1 sm:max-w-xs text-center rounded-xl p-6">
                            <button id="download-button" class="hidden"></button>
                            <span class="block uppercase font-bold tracking-wider text-sm">Export save file</span>
                        </label>
                        <label for="convert-button" class="hidden upload-label flex-1 sm:max-w-xs text-center rounded-xl p-6">
                            <button id="convert-button" class="hidden"></button>
                            <span class="block uppercase font-bold tracking-wider text-sm">Convert to Repentance</span>
                        </label>

                        <div class="error w-full text-center font-bold error-box p-4 rounded-lg hidden"></div>
                    </div>

                    <div class="card rounded-2xl p-6 md:p-8">
                        <h3 class="text-2xl section-title mb-4 tracking-wide">Remember to always make a backup.</h3>
                        <div class="flex flex-col gap-3 text-sm color-muted">
                            <p>Save local data are located:</p>
                            <ul class="list-disc list-inside card-inner p-4 rounded-lg flex flex-col gap-1">
                                <li>Windows: <code class="color-accent font-mono text-xs break-all">&lt;Your Steam Directory&gt;\userdata\&lt;Your user id&gt;\remote\250900</code></li>
                                <li>Linux: <code class="color-accent font-mono text-xs break-all">~\.local\share\Steam\steamapps\compatdata\250900\pfx\drive_c\users\steamuser\Documents\My Games\Binding of Isaac Repentance</code></li>
                            </ul>
                            <p>When you load a save file, it will be stored in your browser's local storage. It will not be uploaded to any server.</p>
                            <p>When you export a save file and paste it in your save folder, you need to go to the stats screen in the game to apply the achievements changes.</p>
                            <p>If you have any issue, please report it via my X account: <a href="https://x.com/Demorck_" target="_blank" class="color-accent font-semibold hover:underline">Demorck_</a>.</p>
                        </div>

                        <hr class="my-6 border-0 border-t" style="border-color: var(--color-border)">

                        <h3 class="text-2xl section-title mb-3 tracking-wide">How to modify the savefile?</h3>
                        <p class="text-sm color-muted">Click the tab you want to modify, then click a button to unlock everything or individual items.</p>

                        <hr class="my-6 border-0 border-t" style="border-color: var(--color-border)">

                        <h3 class="text-2xl section-title mb-3 tracking-wide">Ad free — Donate — Github</h3>
                        <div class="text-sm color-muted flex flex-col gap-1">
                            <p>This website is ad-free. To support me: <a class="color-accent font-bold hover:underline" href="https://patreon.com/demorck" target="_blank">Patreon</a></p>
                            <p>Source code: <a class="color-accent font-bold hover:underline" href="https://github.com/Demorck/Isaac-save-manager" target="_blank">GitHub</a></p>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-6">
                        <div class="flex-1 card rounded-2xl p-6 md:p-8 flex flex-col gap-4">
                            <h2 class="text-2xl section-title tracking-wide">Functionalities</h2>
                            <ul class="list-disc list-inside text-sm color-muted card-inner p-4 rounded-lg flex flex-col gap-1">
                                <li>Unlock all achievements</li>
                                <li>Unlock all marks</li>
                                <li>See all items</li>
                                <li>Finish all challenges</li>
                                <li>See your bestiary and change it</li>
                                <li>Unlock one thing instead of all</li>
                            </ul>

                            <h2 class="text-2xl section-title tracking-wide mt-auto pt-4">Roadmap</h2>
                            <ul class="list-disc list-inside text-sm color-muted card-inner p-4 rounded-lg flex flex-col gap-1">
                                <li>Unlock sins</li>
                                <li>Unlock only characters?</li>
                                <li>Change statistics</li>
                                <li>AB+ support</li>
                                <li class="color-accent">Feedback needed! :)</li>
                            </ul>
                        </div>

                        <div class="flex-1 card rounded-2xl p-6 md:p-8 flex flex-col gap-4">
                            <h2 class="text-2xl section-title tracking-wide">Statistics</h2>
                            <ul id="content-stats" class="list-none font-mono text-sm flex flex-col">
                                <li class="stat-row flex justify-between py-2"><span>Number of deaths:</span> <span id="deaths" class="font-bold color-accent">0</span></li>
                                <li class="stat-row flex justify-between py-2"><span>Mom's Kills:</span> <span id="mom-kills" class="font-bold color-accent">0</span></li>
                                <li class="stat-row flex justify-between py-2"><span>Number of rocks broken:</span> <span id="broken-rocks" class="font-bold color-accent">0</span></li>
                                <li class="stat-row flex justify-between py-2"><span>Shopkeeper kills:</span> <span id="shopkeeper-kills" class="font-bold color-accent">0</span></li>
                                <li class="stat-row flex justify-between py-2"><span>Coins in donation machine:</span> <span id="donation-coins" class="font-bold color-accent">0</span></li>
                                <li class="pt-2 text-center text-xs color-muted italic">More is coming...</li>
                            </ul>
                        </div>
                    </div>

                    <div class="text-center text-xs color-muted max-w-2xl mx-auto pb-8 flex flex-col gap-1">
                        <p>Isaac save editor is an independent project and is not sponsored by, affiliated with or related to the creators or publishers of The Binding of Isaac.</p>
                        <p>Found how the save file works by projects on github except bestiary, sins, statistics and some others stuffs that I need to understand by myself.</p>
                        <p>The sprites come from the wiki <a href="https://bindingofisaacrebirth.wiki.gg/" target="_blank" class="color-accent hover:underline">here</a>.</p>
                    </div>
                </div>
            </div>

            <!-- Achievements -->
            <div id="content-achievements" class="tab-content hidden animate-fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 class="text-3xl font-upheaval page-title tracking-wide">Achievements</h2>
                    <button id="toggle-achievements" class="btn font-bold rounded-lg py-2.5 px-5 text-sm">Toggle all achievements</button>
                </div>
                <div class="mb-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider color-muted">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-white"></div>Unlocked</div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-neutral-600"></div>Locked (greyed)</div>
                </div>
                <div class="card p-3 rounded-xl mb-6 text-sm color-muted">
                    <p>When the game loads the savefile, it will check marks, endings and stats to unlock achievements.<br>For example, if you disable all achievements and you have the "Mom" ending, it will unlock corresponding achievements.</p>
                </div>
                <div class="wrapper flex flex-wrap gap-2 justify-center"></div>
            </div>

            <!-- Marks -->
            <div id="content-marks" class="tab-content flex-col hidden animate-fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 class="text-3xl font-upheaval page-title tracking-wide">Marks</h2>
                    <div class="flex gap-3">
                        <button id="toggle-solo-marks" class="btn font-bold rounded-lg py-2.5 px-5 text-sm">Toggle all solo marks</button>
                        <button id="toggle-online-marks" class="hidden btn font-bold rounded-lg py-2.5 px-5 text-sm">Toggle all online marks</button>
                    </div>
                </div>
                <div class="mb-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider color-muted">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full border" style="border-color: var(--color-border)"></div>Not unlocked</div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-yellow-600"></div>Normal</div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-red-700"></div>Hard</div>
                    <div class="flex items-center gap-2 legend-online hidden"><div class="w-3 h-3 rounded-full bg-blue-600"></div>Online normal</div>
                    <div class="flex items-center gap-2 legend-online hidden"><div class="w-3 h-3 rounded-full bg-purple-700"></div>Online Hard</div>
                </div>
                <div class="wrapper flex flex-wrap flex-col gap-4"></div>
            </div>

            <!-- Items -->
            <div id="content-items" class="tab-content hidden animate-fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 class="text-3xl font-upheaval page-title tracking-wide">Items</h2>
                    <button id="unlock-items" class="btn font-bold rounded-lg py-2.5 px-5 text-sm">See all items</button>
                </div>
                <div class="mb-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider color-muted">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-white"></div>Seen</div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-neutral-600"></div>Not seen (greyed)</div>
                </div>
                <div class="wrapper flex flex-col flex-wrap gap-5"></div>
            </div>

            <!-- Challenges -->
            <div id="content-challenges" class="tab-content hidden animate-fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 class="text-3xl font-upheaval page-title tracking-wide">Challenges</h2>
                </div>
                <div class="mb-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider color-muted">
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-white"></div>To do</div>
                    <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full border line-through" style="border-color: var(--color-border)"></div>Done (strikethrough)</div>
                </div>
                <div class="wrapper flex flex-col gap-5"></div>
            </div>

            <!-- Bestiary -->
            <div id="content-bestiary" class="tab-content hidden animate-fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 class="text-3xl font-upheaval page-title tracking-wide">Bestiary</h2>
                    <button id="unlock-bestiary" class="btn font-bold rounded-lg py-2.5 px-5 text-sm">
                        Unlock Bestiary
                        <span class="text-xs font-normal color-muted block mt-0.5">(set encounter to 1 if locked)</span>
                    </button>
                </div>
                <div class="wrapper flex flex-col gap-5"></div>
            </div>

            <!-- Others -->
            <div id="content-others" class="tab-content hidden animate-fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 class="text-3xl font-upheaval page-title tracking-wide">Others</h2>
                    <button id="unlock-sins" class="btn font-bold rounded-lg py-2.5 px-5 text-sm">Unlock Sins</button>
                </div>
                <div class="wrapper flex flex-col gap-5"></div>
            </div>

        </div>
    </div>

    <!-- Toast container -->
    <div id="toast-container" class="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[100] pointer-events-none"></div>


    <script>
        // Theme switcher
        const THEMES = ['dark', 'light'];
        const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
        const THEME_LABELS = { dark: 'Dark', light: 'Light' };

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeSwitcherBtn.textContent = THEME_LABELS[theme];
        }

        applyTheme(localStorage.getItem('theme') || 'dark');

        themeSwitcherBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'flat';
            const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
            applyTheme(next);
        });

        // Mobile menu toggle
        document.getElementById('hamburger-button').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });

        // Toast system
        window.showToast = function(message, type = 'success', quick = false) {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'} ${quick ? 'toast-quick' : ''} px-5 py-3 rounded-lg font-bold text-sm flex items-center gap-3`;

            const icon = type === 'success'
                ? '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
                : '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

            toast.innerHTML = icon + message;
            container.appendChild(toast);
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, quick ? 1600 : 3100);
        };

        // Drag and drop
        const dropZone = document.getElementById('upload-label');
        const fileInput = document.getElementById('upload-button');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
            dropZone.addEventListener(e, ev => { ev.preventDefault(); ev.stopPropagation(); });
            document.body.addEventListener(e, ev => { ev.preventDefault(); ev.stopPropagation(); });
        });
        dropZone.addEventListener('dragenter', () => dropZone.classList.add('drag-over'));
        dropZone.addEventListener('dragover',  () => dropZone.classList.add('drag-over'));
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', (e) => {
            dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                window.showToast('Save file loaded!');
            }
        });

        // Action button toasts
        const actionMessages = {
            'toggle-achievements': 'Achievements updated!',
            'toggle-solo-marks':   'Solo marks updated!',
            'toggle-online-marks': 'Online marks updated!',
            'unlock-items':        'Items status updated!',
            'unlock-bestiary':     'Bestiary unlocked!',
            'unlock-sins':         'Sins unlocked!',
            'convert-button':      'Save converted successfully!'
        };

        for (const [id, msg] of Object.entries(actionMessages)) {
            document.getElementById(id)?.addEventListener('click', () => window.showToast(msg));
        }

    </script>
    <script type="module" src="<?= getAssetPath("main.js") ?>"></script>
</body>
</html>
