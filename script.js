window.addEventListener("DOMContentLoaded", () => {
    let bg = document.getElementById("bg");
    let glow = document.getElementById("mouseGlow");
    bg.style.backgroundImage = "url('fon1.jpg')";
    glow.style.background = "rgba(146, 151, 199, 0.1)";
});

/* Паралакс рух миші */
document.addEventListener("mousemove", function(e) {
    let glow = document.getElementById("mouseGlow");
    let bg = document.getElementById("bg");
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

/* Плавна зміна теми */
function setTheme(imageName, cubeRgb, glowColor, accentColor) {
    let bg = document.getElementById("bg");
    let glow = document.getElementById("mouseGlow");

    bg.style.opacity = "0";

    setTimeout(() => {
        bg.style.backgroundImage = `url('${imageName}')`;
        bg.style.opacity = "1";
    }, 300);

    document.documentElement.style.setProperty('--cube-rgb', cubeRgb);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    glow.style.background = glowColor;
}