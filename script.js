document.onmousemove = function(e) {
    let glow = document.querySelector(".mouse-glow");

    glow.style.left = e.clientX - 100 + "px";
    glow.style.top = e.clientY - 100 + "px";
}
window.addEventListener("scroll", function() {
    document.body.style.filter = "blur(2px)";

    setTimeout(function() {
        document.body.style.filter = "blur(0)";
    }, 100);
});
