function ToggleClick(y) {
    y.classList.toggle("change");
    var x = document.getElementById("myTopnav");
    var z = document.getElementById("menu")
    if (x.className === "topnav") {
        x.className += " open-menu";
        z.className += "open-menu"
    } else {
        x.className = "topnav";
        z.className = "";
    }
}

function MenuClick(y) {
    y.classList.toggle("open");
}