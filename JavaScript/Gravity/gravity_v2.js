/**
 * BESCHRIJVING: Simulatie van zwaartekracht
 * DATUM: 15 feb 2016
 */

var ctx = c.getContext("2d");
c.height = window.innerHeight, c.width = window.innerWidth;
window.onresize = function() {
    c.height = window.innerHeight, c.width = window.innerWidth;
}

window.onload = function() {
    info = document.createElement("div");
    info.style.background = "rgba(255,255,255,.1)";
    info.style.padding = "5px";
    info.style.fontFamily = "'Roboto Condensed', Arial";
    info.style.position = "absolute";
    info.style.top = "0px";
    info.style.left = "0";
    info.style.color = "white";

    menu_openen = document.createElement("div");
    menu_openen.style.background = "rgba(255,255,255,.1)";
    menu_openen.style.padding = "5px";
    menu_openen.style.transition = "background .2s, bottom .2s";
    menu_openen.style.fontFamily = "'Roboto Condensed', Arial";
    menu_openen.style.position = "absolute";
    menu_openen.style.bottom = "0px";
    menu_openen.style.left = "50%";
    menu_openen.style.color = "white";
    menu_openen.style.height = "20px";
    menu_openen.style.width = "100px";
    menu_openen.style.textAlign = "center";
    menu_openen.innerHTML = "Menu openen";
    menu_openen.onclick = function() {
        menu_openen.style.background = "rgba(255,255,255,.5)";
        menu_openen.style.bottom = "200px";
        menu_openen.innerHTML = "Menu sluiten";
    }

    document.body.appendChild(info);
    document.body.appendChild(menu_openen);
    document.body.style.overflow = "hidden", document.body.style.margin = 0;
    document.oncontextmenu = function(e){
        return false;
    }
}

var background_color = "#2f2f2f";
var offset = { x: 0, y: 0 };
var zoom = 20;
var fps = 0;
var fancy_graphics = true;

var particles = [];

var lastInfoUpdate = new Date, loops = 0;
setInterval(function() {
    ctx.fillStyle = background_color;
    ctx.fillRect(0,0, c.width, c.height);

    if(mouse.buttonsDown[1]) {
        ctx.beginPath();
        ctx.moveTo((particles[particles.length - 1].pos.x + offset.x) * zoom,(particles[particles.length - 1].pos.y + offset.y) * zoom);
        ctx.lineTo(mouse.x * zoom,mouse.y * zoom);
        ctx.strokeStyle = "#aa2222";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    for(var i = 0; i < particles.length; ++i) {
        for(var j = 0; j < particles.length; ++j) {
            if(i == j) continue;

            var dx = Math.abs(particles[i].pos.x - particles[j].pos.x),
                dy = Math.abs(particles[i].pos.y - particles[j].pos.y),
                distance = Math.pow(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)),2);

            if(distance < .5) {
                console.log("gelijk!");
                particles.push({
                    pos: {
                        x: particles[i].pos.x,
                        y: particles[i].pos.y
                    },
                    mass: particles[i].mass + particles[j].mass,
                    color: "#5555aa",
                    velocity: {
                        x: 0,
                        y: 0
                    }
                });
                particles.splice(i,1);
                particles.splice(i < j ? j + 1 : j,1);
                continue;
            }

            var angle = Math.atan2(particles[i].pos.x - particles[j].pos.x,particles[i].pos.y - particles[j].pos.y);

            var F = particles[i].mass * particles[j].mass / distance / 200000000000000000;

            particles[i].velocity.x -= F * Math.sin(angle), particles[i].velocity.y -= F * Math.cos(angle);
        }
        particles[i].pos.x += particles[i].velocity.x;
        particles[i].pos.y += particles[i].velocity.y;

        var x = (particles[i].pos.x + offset.x) * zoom,
            y = (particles[i].pos.y + offset.y) * zoom;

        if(x > -zoom && x < c.width && y > -zoom && y < c.height);
        ctx.beginPath();
        ctx.arc(x,y,Math.log(particles[i].mass) * zoom / 20,0,2 * Math.PI);
        if(fancy_graphics) ctx.shadowColor = "rgba(0,0,0,.25)", ctx.shadowBlur = 20;
        ctx.fillStyle = particles[i].color;
        ctx.fill();
    }

    ++loops;
    if(new Date - lastInfoUpdate > 500) {
        lastInfoUpdate = new Date;

        fps = loops * 2, loops = 0;
        updateInfo();
    }
},1);

var mouse = { buttonsDown: { 1: false, 2: false, 3: false }, x: 0, y: 0 };
c.addEventListener("mousedown", function(e) {
    if(e.which == 1) {
        mouse.buttonsDown[1] = true;

        var particle = {
            pos: {
                x: e.x / zoom - offset.x,
                y: e.y / zoom - offset.y
            },
            mass: 99999999,
            color: "#5555aa",
            velocity: {
                x: 0,
                y: 0
            }
        };
        particles.push(particle);
    } else if(e.which == 2) mouse.buttonsDown[2] = true;
});

c.addEventListener("mouseup", function(e) {
    if(e.which == 1) {
        mouse.buttonsDown[1] = false;

        var dx = (e.x / zoom - offset.x) - particles[particles.length - 1].pos.x,
            dy = (e.y / zoom - offset.y) - particles[particles.length - 1].pos.y;

        var speed = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) / c.width * 5;
        var angle = Math.atan2(dx,dy);

        particles[particles.length - 1].velocity.x = speed * Math.sin(angle);
        particles[particles.length - 1].velocity.y = speed * Math.cos(angle);
    }
    else if(e.which == 2) mouse.buttonsDown[2] = false;
    else mouse.buttonsDown[3] = false;
});

c.addEventListener("mousemove", function(e) {
    if(mouse.buttonsDown[1]) {

    } else if(mouse.buttonsDown[2]) {
        var x = e.x / zoom,
            y = e.y / zoom;
        offset.x += x - mouse.x;
        offset.y += y - mouse.y;
    }
    mouse.x = e.x / zoom;
    mouse.y = e.y / zoom;
});

document.addEventListener("mousewheel", function(e) {
    var x = e.x / zoom,
        y = e.y / zoom;
    if(e.deltaY < 0 && zoom < 200) {
        offset.x -= x * (1 - (x * zoom / (x * (zoom + Math.round(Math.sqrt(zoom))))));
        offset.y -= y * (1 - (y * zoom / (y * (zoom + Math.round(Math.sqrt(zoom))))));
        zoom += Math.round(Math.sqrt(zoom));
    } else if(e.deltaY > 0 && zoom > 2) {
        offset.x -= x * (1 - (x * zoom / (x * (zoom - Math.round(Math.sqrt(zoom))))));
        offset.y -= y * (1 - (y * zoom / (y * (zoom - Math.round(Math.sqrt(zoom))))));
        zoom -= Math.round(Math.sqrt(zoom));
    }
});

function updateInfo() {
    info.innerHTML =
        "FPS: " + fps + "<br>" +
        "Particles: " + particles.length;
}