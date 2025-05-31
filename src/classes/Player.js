import { INICIAL_FRAMES, PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITE, PATH_SPACESHIP_IMAGE } from "../utils/constants.js";
import Projectile from "./projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight) {
        this.alive = true;
        this.width = 48 * 4;
        this.height = 48 * 4;
        this.velocity = 9;

        // 👉 Posição inicial salva
        this.initialPosition = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        // 👇 Usa a posição inicial ao criar
        this.position = {
            x: this.initialPosition.x,
            y: this.initialPosition.y,
        };

        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITE);
        this.sx = 0;
        this.framesCounter = INICIAL_FRAMES;
    }

    getImage(path) {
        const image = new Image();
        image.src = path;
        return image;
    }

    moveleft() {
        this.position.x -= this.velocity;
    }

    moveright() {
        this.position.x += this.velocity;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(this.engineSprites, this.sx, 0, 48, 48, this.position.x, this.position.y + 10, this.width, this.height);
        ctx.drawImage(this.engineImage, this.position.x, this.position.y + 8, this.width, this.height);

        this.update();
    }

    update() {
        if (this.framesCounter === 0) {
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = INICIAL_FRAMES;
        }
        this.framesCounter--;
    }

    shoot(projectiles) {
        const p = new Projectile({
            x: this.position.x + this.width / 2 - 1,
            y: this.position.y + 2
        }, 25);
        projectiles.push(p);
    }

    hit(projectile) {
        return (
            projectile.position.x >= this.position.x + 20 &&
            projectile.position.x <= this.position.x + 20 + this.width - 38 &&
            projectile.position.y >= this.position.y + 22 &&
            projectile.position.y <= this.position.y + 22 + this.height - 34
        );
    }

    // ✅ Novo método para reposicionar o player no início
    resetPosition() {
        this.position.x = this.initialPosition.x;
        this.position.y = this.initialPosition.y;
        this.alive = true;
    }
}

export default Player;
