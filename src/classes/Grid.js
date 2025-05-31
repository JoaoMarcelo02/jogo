import Invader from "./invader.js";

class Grid{
    constructor(rows,cols){
        this.rows = rows;
        this.cols = cols;
        this.invadersVelocity = 2;
        this.invaders = this.init();
        this.direction = "right"
        this.moveDown = false
    }
    init(){
        const array = []
        for(let row=0;row<this.rows;row+=1){
            for(let col = 0; col<this.cols;col+=1){
                const invader = new Invader({
                    x: col * 90 + 20,
                    y: row * 77 + 120,
                }, this.invadersVelocity
              );

              array.push(invader);

            }
        }

        return array;

    }


    draw(ctx){

        this.invaders.forEach(invader => invader.draw(ctx))

    }


    update(playerStatus){
        if(this.reachedRightBoundary()){
        this.direction   = "left"
         this.moveDown = true
        } else if(this.reachedLeftBoundary()){
           this.direction = "right"
         this.moveDown = true
     }

     if(!playerStatus) this.moveDown = false

        this.invaders.forEach((invader) => {
            if(this.moveDown){
                invader.moveDown();
                invader.incrementVelocity(2)
                this.invadersVelocity = invader.velocity;
            }
            if(this.direction === "right") invader.moveright();
            if(this.direction === "left") invader.moveleft();
        
    });
    this.moveDown = false
    }

    reachedRightBoundary(){
        return this.invaders.some(
            (invader) => invader.position.x + invader.width>= innerWidth
        )

    }
    reachedLeftBoundary(){
        return this.invaders.some(
            (invader) => invader.position.x <= 0
        )
    }
    getRandomInvader(){
        const index = Math.floor(Math.random() * this.invaders.length);
        return this.invaders[index];
    }
    
    restart(){
        this.invaders = this.init();
        this.direction = "right";
    }
}

export default Grid;