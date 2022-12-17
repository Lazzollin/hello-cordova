document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
    $("#nav-wrapper").load("other.html")
}

function handleNavigation(page) {
    $("#nav-wrapper").load(page+".html")
}