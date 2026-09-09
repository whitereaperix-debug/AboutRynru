document.addEventListener("mousemove", function(e) {
    let glow = document.querySelector(".mouse-glow");
    let bg = document.getElementById("bg");

    if (glow) {
        glow.style.left = e.clientX - 100 + "px";
        glow.style.top = e.clientY - 100 + "px";
    }

    if (bg) {
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        let xPos = (e.clientX / width - 0.5) * 16;
        let yPos = (e.clientY / height - 0.5) * 16;

        // Паралакс фону працює і чекає на твої нові елементи
        bg.style.transform = `translate(${-xPos}px, ${-yPos}px)`;
    }
});