document.addEventListener("mousemove", function(e) {
    let glow = document.querySelector(".mouse-glow");
    let bg = document.getElementById("bg");
    let sidebar = document.getElementById("sidebar");
    let mainCard = document.getElementById("mainCard");
    let rightCard = document.getElementById("rightCard");
    let inputBar = document.getElementById("inputBar");

    if (glow) {
        glow.style.left = e.clientX - 50 + "px";
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
        
        // Усі блоки синхронно рухаються в паралаксі
        sidebar.style.transform = `translate(${moveX}px, ${moveY}px)`;
        mainCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
        rightCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
        inputBar.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});