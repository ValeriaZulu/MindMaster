export function calculateScore(params: {
    correctAnswers: number
    lives: number
    secondsRemaining: number
}) {
    const { correctAnswers, lives, secondsRemaining } = params

    return (correctAnswers * 100) + (lives * 50) + (secondsRemaining * 5)
}