let config;
let games;
let themes;

function changeLoadingTip() {
    const tips = [
        'making websites is hard',
        'slurd made this',
        'derek wants it',
        'i dont really care - seby'
    ];
    const element = document.getElementsByClassName('loading-tip')[0];
    const periods = [
        ["."],
        [".."],
        ["..."]
    ]
    const elipsis = function() {
        for (i=0; i < periods.length; i++) {
            return periods[i]
    }}
    element.innerHTML = `Loading...<strong><em>` + tips[Math.floor(Math.random() * tips.length)] + '</em></strong>';
}

changeLoadingTip();
$('#everything-else, #page-loader, .games, .proxy, .settings, .cloaklaunch').hide();

let changeTip = setInterval(() => {
    changeLoadingTip();
}, 3000);

fetch('./config.jsonc')
    .then((e) => e.text())
    .then((jsonc) => {
        // removing all the comments from the jsonc file
        let json = JSON.parse(jsonc.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => (g ? '' : m)));
        games = json['games'];
        themes = json['themes'];
        config = json['config'];

        let gamesList = $('#gamesList');
        for (game in games) {
            gamesList.append(
                `<li url="games/${games[game]['path']}" ${
                    games[game]['aliases'] ? 'aliases="' + games[game]['aliases'].join(',') + '"' : ''
                }>${game} <span class="star">★</span> </li>`
            );
        }

        let starredGamesList = JSON.parse(localStorage.getItem('starredGamesList')) || [];
        const stars = document.querySelectorAll('.star');
        stars.forEach((star) => {
            star.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                star.classList.toggle('filled');

                const gameItem = star.parentNode;
                var gameName = gameItem.textContent;
                const isStarred = starredGamesList.includes(gameName);

                if (isStarred) {
                    starredGamesList = starredGamesList.filter((gameName) => gameName !== gameName);

                    //THIS DOES NOT PUT THE GAME BACK IN ORDER ACCORDING TO THE WAY THE USER SORTED IT
                    //so for the weird ppl that sort by reverse alphabetical it should act pretty weird
                    //this is bc im layz and copy pasted this alphabetical sort thing, ill implement based off users sort later
                    const gameItem = star.closest('li');
                    const parent = gameItem.parentNode;

                    const originalPosition = Array.from(parent.children)
                        .sort((a, b) => a.textContent.localeCompare(b.textContent))
                        .findIndex((item) => item === gameItem);

                    parent.removeChild(gameItem);

                    parent.insertBefore(gameItem, parent.children[originalPosition]);
                } else {
                    starredGamesList.unshift(gameName);
                }

                localStorage.setItem('starredGamesList', JSON.stringify(starredGamesList));
                updateGameList();
            });
        });
        // Pushes all starred games to the top
        function updateGameList() {
            const gamesList = document.getElementById('gamesList');
            const children = Array.from(gamesList.children);

            children.forEach((gameItem) => {
                const currentGameName = gameItem.textContent;
                const stars = gameItem.querySelector('.star');

                if (starredGamesList.includes(currentGameName)) {
                    stars.classList.add('filled');
                    gamesList.insertBefore(gameItem, gamesList.firstChild);
                }
            });
        }

        updateGameList();

        $('#gamesList li').on('click', function () {
            let url = $(this).attr('url');
            inGame = true;
            $('#everything-else').fadeOut();
            $('#page-loader').fadeIn();
            $('#page-loader iframe').attr('src', url);
            $('#page-loader iframe')[0].focus();
            currentMenu = $('#page-loader');
        });
    });

$(window).on('load', () => {
    $('.track').attr('stroke', 'url(#grad2)');
    $('.worm1').hide();
    $('.worm2').hide();
    clearInterval(changeTip);

    $('.loading').fadeOut({
        duration: 300,
        complete: () => {
            setTimeout(() => {
                $('#everything-else').fadeIn(
                    {
                        duration: 500,
                        easing: 'swing',
                    },
                    200
                );
            }, 100);
        },
    });
});

jQuery.fn.extend({
    showModal: function () {
        return this.each(function () {
            if (this.tagName === 'DIALOG') {
                this.showModal();
            }
        });
    },
});

(function () {
    let previousTime = Date.now();
    let frames = 0;
    let refreshRate = 1000;

    let fpsMeter = document.createElement('div');
    fpsMeter.id = 'fpsMeter';
    document.body.appendChild(fpsMeter);

    requestAnimationFrame(function loop() {
        const TIME = Date.now();
        frames++;
        if (TIME > previousTime + refreshRate) {
            let fps = Math.round((frames * refreshRate) / (TIME - previousTime));
            previousTime = TIME;
            frames = 0;
            fpsMeter.innerHTML = 'FPS: ' + fps * (1000 / refreshRate);
        }
        requestAnimationFrame(loop);
    });

    fpsMeter.style.position = 'fixed';
    fpsMeter.style.top = '2.5%';
    fpsMeter.style.right = '1%';
    fpsMeter.style.zIndex = '50';
    fpsMeter.style.background = 'rgba(0, 0, 0, 0.5)';
    fpsMeter.style.opacity = '0.5';
    fpsMeter.style.padding = '10px';
    fpsMeter.style.color = 'rgba(255, 255, 255, 0.75)';
    fpsMeter.style.fontFamily = "'Flexi IBM VGA True (437', monospace";
    fpsMeter.style.fontSize = '24px';
    fpsMeter.style.zIndex = '10000';
    fpsMeter.style.pointerEvents = 'none';
})();

/**
 * Loads a font dynamically from Google Fonts.
 *
 * @param {string} fontName - The name of the font to load (e.g., "Krona One").
 * @param {number} [fontWeight=400] - The font weight to load (e.g., 400, 700). Defaults to 400.
 */
function loadFont(fontName, fontWeight = 400) {
    let fontUrl;
  
    if (fontName.includes('https://fonts.google.com/specimen/')) {
      // Extract font name from the URL (e.g., "Roboto" from "https://fonts.google.com/specimen/Roboto")
      const fontNameFromUrl = fontName.split('/').pop(); // Gets "Roboto"
      fontUrl = `https://fonts.googleapis.com/css2?family=${fontNameFromUrl}:wght@${fontWeight}&display=swap`;
    } else if (fontName.includes('https:')) {
         fontUrl = `${fontName.replace('https://', 'https://fonts.googleapis.com/css2?family=')}:wght@${fontWeight}&display=swap`;
    }
     else {
      // Assume it's a font name and construct the URL
      fontUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@${fontWeight}&display=swap`;
    }
  
    // Create a new link element
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
  
    link.onload = () => {
      console.log(`Font "${fontName}" loaded successfully`);
    };
  
    link.onerror = () => {
      console.error(`Failed to load font "${fontName}"`);
    };
  
    document.head.appendChild(link);
  }
  
  
// LOAD FONTS
loadFont("https://fonts.google.com/specimen/Rubik+Glitch", 400);
loadFont("https://fonts.google.com/specimen/Geo", 400);
loadFont("https://fonts.google.com/specimen/Assistant", 400);
loadFont("https://fonts.google.com/specimen/Keania+One", 400);
loadFont("https://fonts.google.com/specimen/Boldonse", 400);
loadFont("https://fonts.google.com/specimen/Chewy", 400);
loadFont("https://fonts.google.com/specimen/Fredoka", 400);
loadFont("https://fonts.google.com/specimen/Krona+One", 400);
loadFont("https://fonts.google.com/specimen/Open+Sans", 400);
loadFont("https://fonts.google.com/specimen/Rubik+Glitch", 400);
loadFont("https://fonts.google.com/specimen/Tektur", 400);
loadFont("https://fonts.google.com/specimen/Bokor", 400);
loadFont("https://fonts.google.com/specimen/Libre+Baskerville", 700);
loadFont("https://fonts.google.com/specimen/Shadows+Into+Light", 400)
loadFont("https://fonts.google.com/specimen/Pangolin", 400)
loadFont("https://fonts.google.com/specimen/Syne+Mono", 400)