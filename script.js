window.addEventListener("DOMContentLoaded", () => {
    let bg = document.getElementById("bg");
    let bgNext = document.getElementById("bgNext");
    let glow = document.getElementById("mouseGlow");
    bg.style.backgroundImage = "url('fon/fon1.jpg')";
    bgNext.style.backgroundImage = "url('fon/fon1.jpg')";
    glow.style.background = "rgba(146, 151, 199, 0.1)";
});

const root = document.documentElement;
const motionBlurStrength = 1.5;
let scrollTimer;
const imageCache = new Map();
const themes = {
    mountains: ["fon/fon1.jpg", "20, 24, 36", "rgba(146, 151, 199, 0.1)", "#566A82", "#26384D"],
    forest: ["fon/fon2.jpg", "25, 35, 28", "rgba(100, 220, 150, 0.08)", "#7E985C", "#34452A"],
    beach: ["fon/fon3.jpg", "35, 33, 28", "rgba(240, 220, 150, 0.08)", "#DCA373", "#6B4A32"],
    sakura: ["fon/fon4.jpg", "38, 30, 36", "rgba(255, 180, 210, 0.08)", "#E5C5C8", "#6B5056"]
};

function preloadImage(imageName) {
    if (!imageCache.has(imageName)) {
        const image = new Image();
        const loadPromise = new Promise((resolve, reject) => {
            image.onload = async () => {
                if (image.decode) {
                    await image.decode();
                }

                resolve(image);
            };
            image.onerror = reject;
        });
        image.src = imageName;
        imageCache.set(imageName, loadPromise);
    }
    return imageCache.get(imageName);
}

Object.values(themes).forEach(([imageName]) => {
    preloadImage(imageName).catch(() => {
        console.error(`Unable to preload theme image: ${imageName}`);
    });
});

/* Паралакс рух миші */
document.addEventListener("mousemove", function(e) {
    let glow = document.getElementById("mouseGlow");
    let bg = document.getElementById("bg");
    let bgNext = document.getElementById("bgNext");
    let sidebar = document.getElementById("sidebar");
    let mainCard = document.getElementById("mainCard");
    let rightCard = document.getElementById("rightCard");
    let inputBar = document.getElementById("inputBar");

    if (glow) {
        glow.style.left = e.clientX - 60 + "px";
        glow.style.top = e.clientY - 50 + "px";
    }

    if (bg && sidebar && mainCard && rightCard && inputBar) {
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        let xPos = (e.clientX / width - 0.5) * 8;
        let yPos = (e.clientY / height - 0.5) * 8;

        bg.style.transform = `translate(${-xPos}px, ${-yPos}px)`;
        bgNext.style.transform = `translate(${-xPos}px, ${-yPos}px)`;
        
        let moveX = xPos * 0.2;
        let moveY = yPos * 0.2;
        
        sidebar.style.transform = `translate(${moveX}px, ${moveY}px)`;
        mainCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
        rightCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
        inputBar.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

/* Плавне перемикання налаштувань при кліку на м'яку крапку */
document.getElementById("settingsDot").addEventListener("click", function() {
    let normalView = document.getElementById("normalView");
    let settingsView = document.getElementById("settingsView");

    normalView.classList.toggle("active");
    settingsView.classList.toggle("active");
});

/* Плавна зміна прозорості кубів при пересуванні повзунків */
document.getElementById("op1").addEventListener("input", function(e) {
    document.documentElement.style.setProperty('--op-1', e.target.value);
});
document.getElementById("op2").addEventListener("input", function(e) {
    document.documentElement.style.setProperty('--op-2', e.target.value);
});
document.getElementById("op3").addEventListener("input", function(e) {
    document.documentElement.style.setProperty('--op-3', e.target.value);
});
document.getElementById("op4").addEventListener("input", function(e) {
    document.documentElement.style.setProperty('--op-4', e.target.value);
});
window.addEventListener("scroll", function() {
    root.classList.add("scrolling");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        root.classList.remove("scrolling");
    }, 140);
});
root.classList.add("smooth-scroll");
root.style.setProperty('--motion-blur-strength', motionBlurStrength);
const themeDropdown = document.getElementById("themeDropdown");
const themeSelect = document.getElementById("themeSelect");
const themeSelectLabel = document.getElementById("themeSelectLabel");

themeSelect.addEventListener("click", function() {
    const isOpen = themeDropdown.classList.toggle("open");
    themeSelect.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll("#themeOptions [data-theme]").forEach((option) => {
    option.addEventListener("click", function() {
        const themeName = option.dataset.theme;
        setTheme(...themes[themeName]);
        themeSelectLabel.textContent = option.textContent;
        themeDropdown.classList.remove("open");
        themeSelect.setAttribute("aria-expanded", "false");
        document.querySelectorAll("#themeOptions [data-theme]").forEach((item) => {
            item.setAttribute("aria-selected", item === option);
        });
    });
});

document.addEventListener("click", function(event) {
    if (!themeDropdown.contains(event.target)) {
        themeDropdown.classList.remove("open");
        themeSelect.setAttribute("aria-expanded", "false");
    }
});

/* Плавна зміна теми */
function setTheme(imageName, cubeRgb, glowColor, accentColor, pageBackground) {
    let bg = document.getElementById("bg");
    let bgNext = document.getElementById("bgNext");
    let glow = document.getElementById("mouseGlow");

    root.classList.add("theme-changing");
    preloadImage(imageName).then(() => {
        bgNext.style.backgroundImage = `url('${imageName}')`;
        bgNext.style.opacity = "1";

        setTimeout(() => {
            bg.style.backgroundImage = `url('${imageName}')`;
            bgNext.style.opacity = "0";
            root.classList.remove("theme-changing");
        }, 750);
    }).catch(() => {
        console.error(`Unable to load theme image: ${imageName}`);
        root.classList.remove("theme-changing");
    });

    document.documentElement.style.setProperty('--cube-rgb', cubeRgb);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--page-background', pageBackground);
    glow.style.background = glowColor;
    const selectedTheme = Object.entries(themes).find(([, values]) => values[0] === imageName);
    if (selectedTheme) {
        const selectedOption = document.querySelector(`#themeOptions [data-theme="${selectedTheme[0]}"]`);
        if (selectedOption) {
            themeSelectLabel.textContent = selectedOption.textContent;
            document.querySelectorAll("#themeOptions [data-theme]").forEach((item) => {
                item.setAttribute("aria-selected", item === selectedOption);
            });
        }
    }
}