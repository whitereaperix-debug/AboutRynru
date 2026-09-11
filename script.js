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
    mountains: ["fon/fon1.jpg", "20, 24, 36", "rgba(146, 151, 199, 0.1)", "#566A82", "#26384D", "#8ea8c4", "#b58fa8"],
    forest: ["fon/fon2.jpg", "25, 35, 28", "rgba(100, 220, 150, 0.08)", "#7E985C", "#34452A", "#9dbb76", "#d1a36f"],
    beach: ["fon/fon3.jpg", "35, 33, 28", "rgba(240, 220, 150, 0.08)", "#DCA373", "#6B4A32", "#f0c28e", "#d78c76"],
    sakura: ["fon/fon4.jpg", "38, 30, 36", "rgba(255, 180, 210, 0.08)", "#E5C5C8", "#6B5056", "#f2cbd1", "#bca4d1"]
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

let loadingTextTimer;

function startLoadingText() {
    const status = document.getElementById("appLoaderStatus");
    if (!status) {
        return;
    }

    const text = "Loading";
    let index = 0;
    let deleting = false;
    let fadeTimer;
    status.textContent = "";

    loadingTextTimer = window.setInterval(() => {
        if (!deleting) {
            index += 1;
            status.textContent = text.slice(0, index);
            if (index === text.length) {
                deleting = true;
                window.clearTimeout(fadeTimer);
                fadeTimer = window.setTimeout(() => {
                    status.classList.add("is-fading");
                    window.setTimeout(() => {
                        status.textContent = "";
                        status.classList.remove("is-fading");
                        index = 0;
                        deleting = false;
                    }, 480);
                }, 700);
            }
        } else {
            return;
        }
    }, 220);
}

function waitForWindowLoad() {
    if (document.readyState === "complete") {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        window.addEventListener("load", resolve, { once: true });
    });
}

function finishAppLoading() {
    const loader = document.getElementById("appLoader");
    window.clearInterval(loadingTextTimer);
    document.documentElement.style.setProperty("--loader-progress", "1");
    document.body.classList.remove("is-loading");
    document.body.setAttribute("aria-busy", "false");

    if (!loader) {
        return;
    }

    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 700);
}

startLoadingText();

const themeImages = Object.values(themes).map(([imageName]) => imageName);
const assetPromises = themeImages.map((imageName, index) => preloadImage(imageName).finally(() => {
    document.documentElement.style.setProperty(
        "--loader-progress",
        String(0.1 + ((index + 1) / themeImages.length) * 0.75)
    );
}));

Promise.race([
    Promise.all([
        Promise.allSettled(assetPromises),
        document.fonts ? document.fonts.ready : Promise.resolve(),
        waitForWindowLoad(),
        new Promise((resolve) => window.setTimeout(resolve, 2200))
    ]),
    new Promise((resolve) => window.setTimeout(resolve, 5000))
]).then(() => {
    document.documentElement.style.setProperty("--loader-progress", "0.94");
    window.setTimeout(finishAppLoading, 180);
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

const waveStrength = document.getElementById("waveStrength");
const glowOpacity = document.getElementById("glowOpacity");

function updateWaveColors(leftColor, rightColor) {
    root.style.setProperty("--wave-left", leftColor);
    root.style.setProperty("--wave-right", rightColor);
}

function createClickWave(event) {
    const wave = document.createElement("div");
    const color = getComputedStyle(root).getPropertyValue(
        event.button === 2 ? "--wave-right" : "--wave-left"
    ).trim();
    wave.className = "click-wave click-wave-color";
    wave.style.left = `${event.clientX}px`;
    wave.style.top = `${event.clientY}px`;
    wave.style.setProperty("--wave-color", color);
    wave.style.setProperty("--wave-scale", waveStrength.value);
    wave.innerHTML = "";
    document.body.appendChild(wave);
    window.setTimeout(() => wave.remove(), 1100);
}

document.addEventListener("mousedown", createClickWave);
document.addEventListener("contextmenu", (event) => event.preventDefault());
glowOpacity.addEventListener("input", (event) => {
    root.style.setProperty("--mouse-glow-opacity", event.target.value);
});
waveStrength.addEventListener("input", (event) => {
    root.style.setProperty("--wave-scale", event.target.value);
});
/* Плавне перемикання налаштувань при кліку на м'яку крапку */
let viewSwitchTimer;
document.getElementById("settingsDot").addEventListener("click", function() {
    let normalView = document.getElementById("normalView");
    let settingsView = document.getElementById("settingsView");
    const outgoingView = settingsView.classList.contains("active") ? settingsView : normalView;
    const incomingView = outgoingView === settingsView ? normalView : settingsView;

    clearTimeout(viewSwitchTimer);
    outgoingView.classList.remove("active");
    viewSwitchTimer = window.setTimeout(() => {
        incomingView.classList.add("active");
    }, 320);
});

document.querySelectorAll("#settingsView > .settings-section").forEach((section) => {
    const summary = section.querySelector("summary");
    const content = section.querySelector(".settings-section-content");

    summary.addEventListener("click", (event) => {
        event.preventDefault();

        if (section.dataset.animating === "true") {
            return;
        }

        section.dataset.animating = "true";

        if (section.open) {
            section.classList.add("is-closing");
            window.setTimeout(() => {
                section.open = false;
                section.classList.remove("is-closing");
                delete section.dataset.animating;
            }, 560);
            return;
        }

        section.open = true;
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                delete section.dataset.animating;
            });
        });
    });

    content.addEventListener("transitionend", (event) => {
        if (event.propertyName === "max-height" && section.classList.contains("is-closing")) {
            section.open = false;
            section.classList.remove("is-closing");
            delete section.dataset.animating;
        }
    });
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
function setTheme(imageName, cubeRgb, glowColor, accentColor, pageBackground, waveLeft, waveRight) {
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
    updateWaveColors(waveLeft, waveRight);
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