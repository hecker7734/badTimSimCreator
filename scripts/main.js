document.getElementById("timer").value = 0 // default value
document.getElementById("firefor").value = 0.2 // default value
document.getElementById("delayfire").value = 0.1 // default value
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
var mousedown = false
var customattack = [{type:"boxcord",stx:250,sty:250,edx:400,edy:400,isattack:false},{type:'heartmode',mode:0,isattack:false},{type:"HeartTeleport",tpx:310,tpy:304,isattack:false}]
var csvcustomattack = ["0,CombatZoneResizeInstant,250,250,400,400","0,HeartMode,0","0,HeartTeleport,310,304"]
var Mousex = 0
var Mousey = 0
var SaveX = 0
var SaveY = 0
var attackangle = 0
var previewImageSize = 1
var maxpreviewImageSize = 1
var maxPreviewImageSizes = [{type:'GasterBlaster','maxsize':2}]
var genVal = null
var shouldAddAttack = false
var fortype = "_blank"
var boxcoords = [250,250,400,400]
ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);
canvas.addEventListener("mousedown", function(){
    mousedown = true
    if (genVal != null) {
        if(shouldAddAttack) {
          clearInterval(genVal)
          customattack[customattack.length] = {type:fortype,x:SaveX,y:SaveY,size:previewImageSize,angle:attackangle} 
                                               //timer,fortype,size,startx,starty,savex,savey,direction,0.2,0.1
        var tempangle = attackangle
        if(document.getElementById("aimPlayer").checked && fortype == "GasterBlaster") {
            attackangle = "$Ang"
            csvcustomattack[csvcustomattack.length] = "0,GetHeartPos,HeartX,HeartY,,,,,,"
            if(document.getElementById("aimPlayer2").checked){
                csvcustomattack[csvcustomattack.length] = "0,RND,X,360,,,,,,"
                csvcustomattack[csvcustomattack.length] = "0,RND,Y,360,,,,,,"
                csvcustomattack[csvcustomattack.length] = "0,ANGLE,Ang,$X,$Y,$HeartX,$HeartY,,,"
                csvcustomattack[csvcustomattack.length] = document.getElementById("timer").value+","+fortype+","+previewImageSize+","+0+","+0+",$X,$Y,"+attackangle+","+document.getElementById("delayfire").value+","+document.getElementById("firefor").value
            } else {
                csvcustomattack[csvcustomattack.length] = "0,ANGLE,Ang,"+SaveX+","+SaveY+",$HeartX,$HeartY,,,"
                csvcustomattack[csvcustomattack.length] = document.getElementById("timer").value+","+fortype+","+previewImageSize+","+0+","+0+","+SaveX+","+SaveY+","+attackangle+","+document.getElementById("delayfire").value+","+document.getElementById("firefor").value
            }
        } else {
            csvcustomattack[csvcustomattack.length] = document.getElementById("timer").value+","+fortype+","+previewImageSize+","+0+","+0+","+SaveX+","+SaveY+","+attackangle+","+document.getElementById("delayfire").value+","+document.getElementById("firefor").value
        }
        attackangle = tempangle
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
        previewImageSize += (e.wheelDelta / e.wheelDelta / 2 *-1)
    } else {
        previewImageSize += e.wheelDelta / e.wheelDelta / 2
    }
    if(previewImageSize >= maxpreviewImageSize) 
        previewImageSize = 1 // loop de loop
    if(previewImageSize <= 0) 
        previewImageSize = maxpreviewImageSize - 1 // loop de loop
    console.log(previewImageSize)
    
});
function generateFor(_fortype) {
    maxpreviewImageSize = 1 + maxPreviewImageSizes.find(x => x.type == _fortype).maxsize;
    if(previewImageSize >= maxpreviewImageSize) 
        previewImageSize = 1
    if(previewImageSize <= 0) 
        previewImageSize = maxpreviewImageSize - 1 
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
        if(atk.isattack == false) return;
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
    box()
}

function exportCsv() {
    let finalString = csvcustomattack.join('\r\n');
    console.log(finalString)
    copyTextToClipboard(finalString)
}
function exportCode() { 
    let finalString = JSON.stringify(customattack)
    console.log(finalString)
    copyTextToClipboard( "'"+ finalString + "'")
}
function ImportCode() { 
    document.getElementsByClassName("overlay")[0].style.display = "none";
    let finalString = JSON.parse(document.getElementById("importCodeString").value)
    customattack = finalString;
    var csvcustomattack = ["0,CombatZoneResizeInstant,250,250,400,400","0,HeartMode,0","0,HeartTeleport,310,304"] // reset to import from customattack
    
    drawAttacks()
}

function setbox() {
    boxcoords = prompt("please type the numbers, firstX, firstY, lastX, lastY, With a comma in between them no spaces!").split(',')
    for (let i = 0; i < boxcoords.length; i++) {
        boxcoords[i] = parseFloat(boxcoords[i])
    }
    if (boxcoords.length > 4)
        alert("Invalid Cords, Please Try again. \n error: too many cords.")
    if (boxcoords.findIndex(n => Number.isNaN(n)) != -1)
        alert("Invalid Cords, Please Try again. \n error: one or more cords are not a number and could not be parsed.")
}

function box() {
    ctx.strokeStyle = "white"
    ctx.lineWidth = 4
    ctx.strokeRect(boxcoords[0],boxcoords[1],boxcoords[2],boxcoords[3])
}
box()


function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      //alert(msg + " Copy");
    } catch (err) {
      alert("Copy Failed")
    }
    document.body.removeChild(textArea);
}
