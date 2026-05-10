import { Howl } from 'howler'

type SoundKey = 'correct' | 'incorrect' | 'powerup' | 'complete'

const soundMap: Record<SoundKey, Howl> = {
    correct: new Howl({ src: ['/sounds/correct.wav'], volume: 0.35 }),
    incorrect: new Howl({ src: ['/sounds/incorrect.wav'], volume: 0.35 }),
    powerup: new Howl({ src: ['/sounds/powerup.wav'], volume: 0.4 }),
    complete: new Howl({ src: ['/sounds/complete.wav'], volume: 0.45 }),
}

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
}
