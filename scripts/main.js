var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var mousedown = false
var customattack = []
var Mousex = 0
var Mousey = 0
canvas.addEventListener("mousedown", function(){
    mousedown = true
});
canvas.addEventListener("mouseup", function(){
    mousedown = false
});

function generateFor(fortype) {
    var genVal = setInterval(function() {
        var img = document.getElementById(fortype);
        ctx.drawImage(img, Mousex, Mousey);
    },100)
}

function getPos(e){
    var rect = canvas.getBoundingClientRect();
    Mousex=e.clientX - rect.left;
    Mousey=e.clientY - rect.top;
}