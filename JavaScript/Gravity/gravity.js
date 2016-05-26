var ctx = c.getContext("2d");
c.height = window.innerHeight,
c.width = window.innerWidth;

var objects = [];

function randomColor() {
    return "rgb(" + (Math.random() < .25 ? "aa" : "55")  + "," + (Math.random() < .25 ? "aa" : "55") + "," + (Math.random() < .25 ? "aa" : "55") + ")"; 
}

var mouse = {x: 0, y: 0};
var mousedown = false;
document.addEventListener("mousedown", function(e) {
    mousedown = true;
    
    var object = {
        pos: {
            x: e.pageX,
            y: e.pageY
        },
        mass: 99999999,
        color: randomColor(),
        velocity: {
            x: 0,
            y: 0
        }
    };
    objects.push(object);
});

document.addEventListener("mousemove", function(e) {
    mouse.x = e.pageX, mouse.y = e.pageY;
});

document.addEventListener("mouseup", function(e) {
    mousedown = false;
    
    var dx = e.pageX - objects[objects.length - 1].pos.x,
        dy = e.pageY - objects[objects.length - 1].pos.y;
    
    var speed = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) / c.width * 2;
    var angle = Math.atan2(dx,dy);
    
    objects[objects.length - 1].velocity.x = speed * Math.sin(angle),
    objects[objects.length - 1].velocity.y = speed * Math.cos(angle);
});

setInterval(function() {
    ctx.fillStyle = "#2f2f2f";
    ctx.fillRect(0,0,c.width,c.height);
    
    if(mousedown) {
        ctx.beginPath();
        ctx.moveTo(objects[objects.length - 1].pos.x,objects[objects.length - 1].pos.y);
        ctx.lineTo(mouse.x,mouse.y);
        ctx.strokeStyle = "#aaaaaa";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    for(var i = 0; i < objects.length; ++i) {
        objects[i].pos.x += objects[i].velocity.x,
        objects[i].pos.y += objects[i].velocity.y;   
        var object = objects[i];
        ctx.beginPath();
        ctx.arc(object.pos.x,object.pos.y,12,0,Math.PI * 2);
        ctx.fillStyle = object.color;
        ctx.fill();
    }
},1);