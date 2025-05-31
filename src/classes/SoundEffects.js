class SoundEffects{
    constructor(){
        this.shootSounds = [
        new Audio('..//../assets/audios/shoot.mp3'),
        new Audio('..//../assets/audios/shoot.mp3'),
        new Audio('..//../assets/audios/shoot.mp3'),
        new Audio('..//../assets/audios/shoot.mp3'),
        new Audio('..//../assets/audios/shoot.mp3'),
        ]
         this.hitSounds = [
        new Audio('..//../assets/audios/hit.mp3'),
        new Audio('..//../assets/audios/hit.mp3'),
        new Audio('..//../assets/audios/hit.mp3'),
        new Audio('..//../assets/audios/hit.mp3'),
        new Audio('..//../assets/audios/hit.mp3'),
        ]
        this.explosionSound = new Audio("..//../assets/audios/explosion.mp3")
        this.nextLevelSound = new Audio("..//../assets/audios/next_level.mp3")

        this.currentShootSound = 0
        this.currentHitSound = 0
        

        this.adjustvolume()

    }

    playShootSound(){
        this.shootSounds[this.currentShootSound].currentTime = 0
        this.shootSounds[this.currentShootSound].play()
        this.currentShootSound = (this.currentShootSound + 1) % this.shootSounds.length
    }
    playHitSound(){
        this.hitSounds[this.currentHitSound].currentTime = 0
        this.hitSounds[this.currentHitSound].play()
        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length
    }


    playExplosionSound(){
        this.explosionSound.play()
    }
    playNextLevelSound(){
        this.nextLevelSound.play()
    }



    adjustvolume(){
        this.hitSounds.forEach(sound => sound.volume = 0.2)
        this.shootSounds.forEach(sound => sound.volume = 0.5)
        this.explosionSound.volume = 0.2
        this.nextLevelSound.volume = 0.4
    }

}


export default SoundEffects