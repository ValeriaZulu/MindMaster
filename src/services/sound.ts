import { Howl } from 'howler'

type SoundKey = 'correct' | 'incorrect' | 'powerup' | 'complete' | 'failed'

const soundMap: Record<SoundKey, Howl> = {
    correct: new Howl({ src: ['/sounds/correct.wav'], volume: 0.7 }),
    incorrect: new Howl({ src: ['/sounds/incorrect.mp3'], volume: 0.7 }),
    powerup: new Howl({ src: ['/sounds/powerup.wav'], volume: 0.7 }),
    complete: new Howl({ src: ['/sounds/complete.wav'], volume: 0.7 }),
    failed: new Howl({ src: ['/sounds/failed.wav'], volume: 0.7 }),
}

const backgroundMusic = new Howl({
    src: ['/sounds/game-music.wav'],
    loop: true,
    volume: 0.4,
    html5: true
})

export function playSound(sound: SoundKey) {
    const instance = soundMap[sound]

    if (!instance) {
        return
    }

    instance.stop()
    instance.play()
}

export function stopAllSounds() {
    Object.values(soundMap).forEach((sound) => sound.stop())
    backgroundMusic.stop();
}
export function playMusic() {
    if (!backgroundMusic.playing()) {
        backgroundMusic.play();
    }
}

export function stopMusic() {
    backgroundMusic.stop();
}
