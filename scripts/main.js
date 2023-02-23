document.getElementById("timer").value = 0 // default value
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var mousedown = false
var customattack = []
var csvcustomattack = []
var Mousex = 0
var Mousey = 0
var SaveX = 0
var SaveY = 0
var attackangle = 0
var previewImageSize = 0
var maxpreviewImageSize = 1
var maxPreviewImageSizes = [{type:'GasterBlaster','m':2}]
var genVal = null
var shouldAddAttack = false
var fortype = "_blank"
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);
canvas.addEventListener("mousedown", function(){
    mousedown = true
    if (genVal != null) {
        if(shouldAddAttack) {
          clearInterval(genVal)
          customattack[customattack.length] = {type:fortype,x:SaveX,y:SaveY,size:previewImageSize,angle:attackangle} 
                                               //timer,fortype,size,startx,starty,savex,savey,direction,0.2,0.1
          csvcustomattack[csvcustomattack.length] = document.getElementById("timer").value+","+fortype+","+previewImageSize+","+0+","+0+","+SaveX+","+SaveY+","+attackangle+","+0.2+","+0.1
          shouldAddAttack = false
        }
    }
});
canvas.addEventListener("mouseup", function(){
    mousedown = false
});
canvas.addEventListener('mousewheel', function(e){
    if (e.shiftKey) {
        if (e.wheelDelta > 0) {
            if(e.altKey) {
                attackangle -= 6
            } else {
            attackangle -= 1
            }
        } else {
            if(e.altKey) {
                attackangle += 6
            } else {
            attackangle += 1
            }
        }
        if(attackangle > 360) 
            attackangle = 360
        if(attackangle < 0) 
            attackangle = 0
        console.log(attackangle)
        return
    }
    if (e.wheelDelta < 0) {
        previewImageSize += (e.wheelDelta / e.wheelDelta *-1)
    } else {
        previewImageSize += e.wheelDelta / e.wheelDelta  
    }
    console.log(previewImageSize % maxpreviewImageSize);
    previewImageSize %= maxpreviewImageSize
    if(previewImageSize == 0) {
    previewImageSize = 1
    }
});
function generateFor(_fortype) {
    maxpreviewImageSize = 1 + maxPreviewImageSizes.find(x => x.type == 'GasterBlaster').m;
    previewImageSize = 1
    fortype = _fortype
    shouldAddAttack = true
     genVal = setInterval(function() {
         var img = document.getElementById(_fortype);
         x = Mousex - previewImageSize * img.width / 2 
         y = Mousey - previewImageSize * img.height / 2
         ctx.fillStyle = "black";
         ctx.fillRect(0,0,canvas.width, canvas.height);
         ctx.drawImage(img,x,y,previewImageSize * img.width, previewImageSize * img.height);
         r = 50;
         theta = attackangle
         ctx.strokeStyle = "red"
         ctx.lineWidth = 4;
         ctx.beginPath();
         ctx.moveTo(x, y );
         ctx.lineTo(x + r * Math.cos(Math.PI * theta / 180.0), y + r * Math.sin(Math.PI * theta / 180.0));
         ctx.stroke();
         drawAttacks()
        SaveX = Mousex - previewImageSize * img.width / 2
        SaveY = Mousey - previewImageSize * img.height / 2
    },10)
}

function getPos(e){
    var rect = canvas.getBoundingClientRect();
    Mousex=e.clientX - rect.left;
    Mousey=e.clientY - rect.top;
}
function drawAttacks() {
    customattack.forEach(function(atk) {
        img = document.getElementById(atk.type)
        ctx.drawImage(img, atk.x, atk.y, atk.size * img.width, atk.size * img.height);
        ctx.lineWidth = 4;
        theta = atk.angle
        ctx.strokeStyle = "blue"
        ctx.beginPath();
        ctx.moveTo(atk.x, atk.y);
        ctx.lineTo(atk.x + r * Math.cos(Math.PI * theta / 180.0), atk.y + r * Math.sin(Math.PI * theta / 180.0));
        ctx.stroke();
    })
}

function exportCsv() {
    let finalString = csvcustomattack.join('\r\n');
    console.log(finalString)
    alert(finalString)
}