const screen = document.querySelector('canvas');
const brush = screen.getContext('2d');

let player1 = new Tank(50, (screen.height/2 + 20),"img/tank.png", 180, "blue", false, './sfx/hit.wav', './sfx/engine1.wav');
let player2 = new Tank((screen.width - 50), (screen.height/2 + 20),"img/tank.png", 0, "red", false, './sfx/hit2.wav', './sfx/engine2.wav');

let hitted = false;

var isPlaying = false;
let gameover = false;

var ambAudio = new Audio('./sfx/drone_amb.wav');

let mapN = Math.floor(Math.random() * 3);

let wall1, wall2, wall3, wall4;


if(mapN == 0)
{
    wall1 = new Wall(250, screen.height/2, 20, 200);
    wall2 = new Wall(screen.width/2, 0, 20, 300);
    wall3 = new Wall(screen.width/2, screen.height, 20, 300);
    wall4 = new Wall(screen.width-250, screen.height/2, 20, 200);
}
else if(mapN == 1)
{
    wall1 = new Wall(screen.width/2, 130, 600, 20);
    wall2 = new Wall(screen.width/2, screen.height - 130, 600, 20)
    wall3 = new Wall(300, screen.height/2, 20, 130);
    wall4 = new Wall(screen.width - 300, screen.height/2, 20, 130);
}
else if(mapN == 2)
{
    wall1 = new Wall(200, 100, 20, 200);
    wall2 = new Wall(screen.width - 200, screen.height - 100, 20, 200);
    wall3 = new Wall(350, 400, 20, 200);
    wall4 = new Wall(screen.width - 350, screen.height - 400, 20, 200);
}

screen.addEventListener('pointerdown', function()
{
    screen.focus();
});

screen.addEventListener('keydown', function(e)
{
    if(!isPlaying)
    {
        isPlaying = true;
        ambAudio.loop = true;
        ambAudio.volume = 0.6;
        ambAudio.play();
    }
    

    if(document.activeElement == screen && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key))
    {
        e.preventDefault();
    }
    if(!player1.hitted && !player2.hitted)
    { 
        if(e.key == "ArrowUp")
        {
            player2.speed = -2;
            player2.engineAudio.play();
        }
        if(e.key == "ArrowDown")
        {
            player2.speed = 2;
            player2.engineAudio.play();
        }
        if(e.key == "ArrowLeft")
        {
            player2.angle -= 30;
        }
        if(e.key == "ArrowRight")
        {
            player2.angle += 30;
        }
        if(e.key == "Enter")
        {
            player2.shot();
            
        }

        if(e.key == "w")
        {
            player1.speed = -2;
            player1.engineAudio.play();
        }
        if(e.key == "s")
        {
            player1.speed = 2;
            player1.engineAudio.play();
        }
        if(e.key == "a")
        {
            player1.angle -= 30;
        }
        if(e.key == "d")
        {
            player1.angle += 30;
        }
        if(e.key == " ")
        {
            player1.shot();
            
        }
    }
})

screen.addEventListener('keyup', function(e)
{
    if(e.key == "ArrowUp" || e.key == "ArrowDown")
    {
        player2.engineAudio.pause();
        player2.speed = 0;
    }
    if(e.key == "w" || e.key == "s")
    {
        player1.engineAudio.pause();
        player1.speed = 0;
    }
})

let tanks = [player1, player2];
let walls = [wall1, wall2, wall3, wall4];

function draw()
{
    player1.sketch();
    player2.sketch();
}

function update()
{
    score();

    for(let i = 0; i < walls.length; i++)
    {
        walls[i].sketch();
    }

    player1.move(walls);
    player2.move(walls);

    if (player1.hitSpin) player1.angle += 30;
    if (player2.hitSpin) player2.angle += 30;

    player1.bulletMovement();
    player2.bulletMovement();

    player1.bulletCollision(tanks);
    player1.bulletCollision(walls);
    player2.bulletCollision(tanks);
    player2.bulletCollision(walls);

    for (const powerup of powerups) {
        powerup.sketch();
    }

    checkPowerupCollisions();
}

function score()
{
    brush.fillStyle = "white";
    brush.textAlign = "center";
    brush.font = "70px Sixtyfour";

    if(player1.points > 7 || player2.points > 7)
    {
        gameover = true;
        setInterval(()=>{
            window.location.reload()
        }, 3000)
    }

    brush.fillText(player1.points, 100, screen.height/2 + 30);
    brush.fillText(player2.points, screen.width-100, screen.height/2 + 30);
}

function main()
{
    brush.clearRect(0, 0, screen.width, screen.height);
    if (gameover) gameOver();
    else if (!isPlaying) menu();
    else{
        update();
        draw();
    }
}

function menu()
{
    brush.fillStyle = "black";
    brush.fillRect(0, 0, screen.width, screen.height);

    drawStars();

    brush.fillStyle = "white";
    brush.textAlign = "center";

    brush.font = "40px Sixtyfour";
    brush.fillText("EMBATE", screen.width/2, screen.height/2 - 100);

    brush.font = "20px Sixtyfour";
    brush.fillText("Pressione qualquer tecla para iniciar", screen.width/2, screen.height/2 + 100);
}

function gameOver()
{
    brush.fillStyle = "white";
    brush.textAlign = "center";
    brush.font = "40px Sixtyfour";

    if(player1.points > player2.points)
    {
        brush.fillText("Jogador 1 venceu", screen.width/2, screen.height/2 + 100);
    }
    else if(player1.points < player2.points)
    {
        brush.fillText("Jogador 2 venceu", screen.width/2, screen.height/2 + 100);
    }
}

// Stars background on menu screen
let stars = [];

for (let i = 0; i < 35; i++) {
    stars.push({
        x: Math.random() * screen.width,
        y: Math.random() * screen.height,
        size: Math.random() * 2 + 1,
        brightness: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.04 + 0.01
    });
}

function drawStars() {
    for (let star of stars) {
        star.brightness += star.speed;

        // Smoothly pulsate between dim and bright
        let alpha = 0.25 + (Math.sin(star.brightness) + 1) * 0.375;

        brush.globalAlpha = alpha;
        brush.fillStyle = "white";
        brush.beginPath();
        brush.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        brush.fill();
    }

    brush.globalAlpha = 1;
}

let powerups = [];

let spawnTimer = null;

function spawnPowerup() {
    if (player1.tripleShot || player2.tripleShot) return;

    const x = Math.random() * (screen.width - 100) + 50;
    const y = Math.random() * (screen.height - 100) + 50;

    powerups.push(new TripleShotPowerup(x, y));
}

function schedulePowerupSpawn() {
    if (player1.tripleShot || player2.tripleShot) return;
    if (spawnTimer !== null) return;

    const randomTime = Math.random() * 10000 + 5000;

    spawnTimer = setTimeout(() => {
        spawnTimer = null;
        if (player1.tripleShot || player2.tripleShot) return;
        spawnPowerup();
    }, randomTime);
}

function checkPowerupCollisions() {
    for (const powerup of powerups) {
        if (!powerup.active) continue;

        for (const tank of tanks) {
            if (powerup.collision(tank)) {
                powerup.applyEffect(tank);
                clearTimeout(spawnTimer);
                spawnTimer = null;

                break;
            }
        }
    }
}

schedulePowerupSpawn();
setInterval(main, 10);

if (window.location.hash === '#game') {
    window.addEventListener('load', () => {
        screen.focus();
    });
}
