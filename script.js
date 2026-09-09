document.addEventListener("mousemove", function(e) {
    let glow = document.querySelector(".mouse-glow");
    let bg = document.getElementById("bg");
    let hero = document.getElementById("heroText");
    let corner = document.getElementById("cornerZone");

    if (glow) {
        glow.style.left = e.clientX - 100 + "px";
        glow.style.top = e.clientY - 100 + "px";
    }

    if (bg && hero && corner) {
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        let xPos = (e.clientX / width - 0.5) * 16;
        let yPos = (e.clientY / height - 0.5) * 16;

        // Фон рухається
        bg.style.transform = `translate(${-xPos}px, ${-yPos}px)`;
        
        // Тепер текст гарантовано рухається разом із фоном (м'якше) без конфліктів трансформації
        hero.style.transform = `translate(${xPos * 0.4}px, ${yPos * 0.4}px)`;
        
        // Кнопки в кутку ледь-ледь дихають у такт
        corner.style.transform = `translate(${xPos * 0.2}px, ${yPos * 0.2}px)`;
    }
});