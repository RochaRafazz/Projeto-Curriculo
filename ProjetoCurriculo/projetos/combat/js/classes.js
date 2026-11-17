class Tank{
    constructor(x,y,image,angle,color,inv, hitSfx, engineSfx){
        this.type = "tank";
        this.x = x;
        this.y = y;
        this.inv = inv;
        this.angle = angle;
        this.color = color;

        this.image = new Image();
        this.image.src = image;

        this.hitted = false;
        this.size = 40;
        this.bullets = [];
        this.tripleShot = false;
        this.tripleShotTimer = null;
        this.hitTimer = null;
        this.hitSpin = false;

        this.isMoving = false;

        this.shootAudio = new Audio('./sfx/shoot.wav');
        this.hitAudio = new Audio(hitSfx);
        this.engineAudio = new Audio(engineSfx);
        this.engineAudio.loop =true;

        this.points = 0;
    }

    sketch()
    {
        brush.save();

        brush.imageSmoothingEnabled = false;
        
        brush.translate(this.x, this.y);
        brush.rotate(this.angle * Math.PI / 180);

        brush.drawImage(this.image, -this.size/2, -this.size/2, this.size ,this.size); 

        brush.globalCompositeOperation = "source-atop";
        brush.fillStyle = this.color;
        brush.globalAlpha = 0.5;
        brush.fillRect(-this.size/2, -this.size/2, this.size, this.size);

        brush.restore();
    }  

    move(obj) 
    {
        let rad = this.angle * Math.PI / 180;

        let nextX = this.x + Math.cos(rad) * this.speed;
        let nextY = this.y + Math.sin(rad) * this.speed;

        if (nextX - this.size/2 > 0 && nextX + this.size/2 < screen.width && nextY - this.size/2 > 0 && nextY + this.size/2 < screen.height && !this.hitted){
            for(let i = 0; i < obj.length; i++)
            {
                if(((nextX + this.size/2) > obj[i].x - obj[i].width/2 && (nextX - this.size/2) < obj[i].x + obj[i].width/2 && (nextY + this.size/2) > obj[i].y - obj[i].height/2 && (nextY - this.size/2) < obj[i].y + obj[i].height/2))
                {
                    this.engineAudio.pause();
                    return;
                }
            }

            if(this.speed != 0 && this.engineAudio.paused)
            {
                this.engineAudio.play();
            }

            this.x = nextX;
            this.y = nextY;


        }
        else
        {
            this.engineAudio.pause();
        }
    }

    shot() {
        if (this.hitted) return;
        if (this.bullets.some(b => b.active)) return;
        
        this.shootAudio.play();

        const angles = this.tripleShot ? [-30, 0, 30] : [0];

        for (const offset of angles) {
            const bullet = new Bullet(this.x, this.y, 5, 5, this.color, this);

            const rad = (this.angle + offset) * Math.PI / 180;

            bullet.active = true;
            if (this.tripleShot) {
                bullet.expireTime = setTimeout(() => {
                    bullet.active = false;
                    bullet.expireTime = null;
                }, 300);
            }

            bullet.xSpeed = -Math.cos(rad) * bullet.speed;
            bullet.ySpeed = -Math.sin(rad) * bullet.speed;

            this.bullets.push(bullet);
        }
    }

    bulletMovement() {
        for (const bullet of this.bullets) {
            bullet.move();
            bullet.sketch();
        }

        this.bullets = this.bullets.filter(b => b.active);
    }

    bulletCollision(objects) {
        for (const bullet of this.bullets) {
            if (!bullet.active) continue;

            this.checkBulletCollision(bullet, objects);
        }
    }

    checkBulletCollision(bullet, objects) {
        for (const obj of objects) {
            if (obj === this) continue;

            if (obj.type === "wall") {
                if (bullet.x + bullet.size / 2 > obj.x - obj.width / 2 && bullet.x - bullet.size / 2 < obj.x + obj.width / 2 && bullet.y + bullet.size / 2 > obj.y - obj.height / 2 && bullet.y - bullet.size / 2 < obj.y + obj.height / 2)
                {
                    if ((bullet.xSpeed > 0 && bullet.x - bullet.size / 2 < obj.x - obj.width / 2) || (bullet.xSpeed < 0 && bullet.x + bullet.size / 2 > obj.x + obj.width / 2)) 
                    {
                        bullet.xSpeed *= -1;
                        bullet.bounce++;
                    }

                    if ((bullet.ySpeed > 0 && bullet.y - bullet.size / 2 < obj.y - obj.height / 2) || (bullet.ySpeed < 0 && bullet.y + bullet.size / 2 > obj.y + obj.height / 2)) 
                    {
                        bullet.ySpeed *= -1;
                        bullet.bounce++;
                    }
                }

                continue;
            }

            if (bullet.collision(obj)) {
                if (obj.type === "tank") 
                {
                    this.hitAudio.play();
                    this.points++;
                    obj.hitted = true;
                    obj.hitSpin = true;
                    this.hitted = true;

                    clearTimeout(obj.hitTimer);

                    obj.hitTimer = setTimeout(() => {
                        obj.hitted = false;
                        obj.hitSpin = false;
                        setTimeout(()=>
                        {
                            this.hitted = false;
                        }, 300);
                    }, 1500);
                }

                break;
            }
        }
    }
}

class Bullet{
    constructor(x,y,speed,size,color,origin)
    {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.color = color;
        this.origin = origin;
        
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.active = false;
        this.maxbounce = 3;
        this.bounce = 0;
        this.expireTime = null;
    }

    sketch()
    {
        if(!this.active)
        {
            return;
        }
        brush.save();
        brush.translate(this.x, this.y);

        brush.fillStyle = this.color;
        brush.fillRect(-this.size/2, -this.size/2, this.size, this.size);

        brush.restore();
    }

    move()
    {
        if(!this.active)
        {
            return;
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if(this.x - this.size/2 < 0 || this.x + this.size/2 > screen.width)
        {
            this.xSpeed *= -1;
            this.bounce++;
        }
        if(this.y - this.size/2 < 0 || this.y + this.size/2 > screen.height)
        {
            this.ySpeed *= -1;
            this.bounce++;
        }
        if (this.bounce >= this.maxbounce) 
        {
            this.active = false;
            this.bounce = 0;

            clearTimeout(this.expireTime);
            this.expireTime = null;
        }
    }

    collision(col)
    {
        if(!this.active)
        {
            return false;
        }

        if(this.x + this.size/2 > col.x - col.size/2 && this.x - this.size/2 < col.x + col.size/2 && this.y + this.size/2 > col.y - col.size/2 && this.y - this.size/2 < col.y + col.size/2)
        {
            this.active = false;
            return true;
        }
        else
        {
            return false;
        }
    }
}

class Wall
{
    constructor(x,y,width,height)
    {
        this.type = "wall";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    sketch()
    {
        brush.save();

        brush.fillStyle = "orange";
        brush.translate(this.x, this.y);
        brush.fillRect(-this.width/2, -this.height/2, this.width, this.height);

        brush.restore();
    }
}

class Powerups {
    constructor(x, y, width, height) {
        this.type = "powerups";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;

        this.powerupAudio = new Audio('./sfx/powerup.wav');
    }

    sketch() {
        if (!this.active) return;

        brush.save();

        brush.fillStyle = "gray";
        brush.translate(this.x, this.y);
        brush.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        brush.restore();
    }

    collision(tank) {
        if (!this.active) return false;

        const collided = this.x - this.width / 2 < tank.x + tank.size / 2 && this.x + this.width / 2 > tank.x - tank.size / 2 && this.y - this.height / 2 < tank.y + tank.size / 2 && this.y + this.height / 2 > tank.y - tank.size / 2;

        if (collided) {
            this.active = false;
            this.powerupAudio.play();
            return true;
        }

        return false;
    }
}

class TripleShotPowerup extends Powerups {
    constructor(x, y) {
        super(x, y, 24, 24);
        this.type = "tripleShot";
        this.active = true;
    }

    sketch() {
        if (!this.active) return;

        brush.save();

        brush.translate(this.x, this.y);

        brush.fillStyle = "orange";
        brush.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        brush.fillStyle = "white";
        brush.font = "bold 14px Sixtyfour";
        brush.textAlign = "center";
        brush.textBaseline = "middle";
        brush.fillText("?", 0, 0);

        brush.restore();
    }

    applyEffect(tank) {
    tank.tripleShot = true;

    clearTimeout(tank.tripleShotTimer);

    tank.tripleShotTimer = setTimeout(() => {
        tank.tripleShot = false;
        tank.tripleShotTimer = null;

        if (!player1.tripleShot && !player2.tripleShot) {
            schedulePowerupSpawn();
        }

    }, 10000);
}
}