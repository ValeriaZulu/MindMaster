import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MobileLayout } from '../../components/layout/MobileLayout'
import { ScreenCard } from '../../components/ui/ScreenCard'
import { useGameLogic } from '../../hooks/useGameLogic'
import { TRIVIA_LEVELS, useTrivia } from '../../hooks/useTrivia'
import { db, isFirebaseConfigured } from '../../services/firebase'
import { useGameStore } from '../../store/gameStore'
import type { LevelId, TriviaQuestion } from '../../types/game'
import { calculateScore } from '../../utils/scoring'

const QUESTION_TIME_SECONDS = 15

function shuffleOptions(question: TriviaQuestion) {
    const options = [question.correctAnswer, ...question.incorrectAnswers]

    for (let index = options.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const temp = options[index]

        options[index] = options[randomIndex]
        options[randomIndex] = temp
    }

    return options
}

export function GameScreen() {
    const navigate = useNavigate()
    const params = useParams()
    const user = useGameStore((state) => state.user)
    const levelId = params.levelId && params.levelId in TRIVIA_LEVELS ? (params.levelId as LevelId) : 'novato'
    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS]
    const { questions, isLoading, error, getQuestionsForLevel } = useTrivia()
    const {
        progress,
        startLevel,
        registerCorrectAnswer,
        registerIncorrectAnswer,
        setSecondsRemaining,
        setRoundScore,
        setCorrectAnswers,
        updateBestScore,
    } = useGameLogic()

    const [questionIndex, setQuestionIndex] = useState(0)
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [isResolvingAnswer, setIsResolvingAnswer] = useState(false)
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [accumulatedSeconds, setAccumulatedSeconds] = useState(0)
    const isFinishingRound = useRef(false)
    const intervalRef = useRef<number | null>(null)
    const hasLoadedLevelRef = useRef(false)
    const resolveAnswerRef = useRef<(answer: string | null) => void>(() => undefined)

    const currentQuestion = questions[questionIndex]
    const currentOptions = useMemo(
        () => (currentQuestion ? shuffleOptions(currentQuestion) : []),
        [currentQuestion],
    )

    useEffect(() => {
        if (hasLoadedLevelRef.current) {
            return
        }

        hasLoadedLevelRef.current = true
        startLevel(level.id)
        setQuestionIndex(0)
        setTimeLeft(QUESTION_TIME_SECONDS)
        setSelectedAnswer(null)
        setIsResolvingAnswer(false)
        setCorrectAnswersCount(0)
        setAccumulatedSeconds(0)
        isFinishingRound.current = false

        void getQuestionsForLevel(level.id)
    }, [getQuestionsForLevel, level.id, startLevel])

    useEffect(() => {
        if (!currentQuestion || isResolvingAnswer || isFinishingRound.current) {
            return
        }

        if (intervalRef.current) {
            window.clearInterval(intervalRef.current)
        }

        intervalRef.current = window.setInterval(() => {
            setTimeLeft((previous) => {
                if (previous <= 1) {
                    if (intervalRef.current) {
                        window.clearInterval(intervalRef.current)
                        intervalRef.current = null
                    }

                    queueMicrotask(() => {
                        resolveAnswerRef.current(null)
                    })

                    return 0
                }

                return previous - 1
            })
        }, 1000)

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [currentQuestion, isResolvingAnswer])

    const syncResultToFirestore = useCallback(async (finalScore: number, livesLeft: number) => {
        if (!isFirebaseConfigured || !db || !user) {
            return
        }

        await setDoc(
            doc(db, 'users', user.uid),
            {
                uid: user.uid,
                displayName: user.displayName,
                bestScore: Math.max(user.bestScore, finalScore),
                lastScore: finalScore,
                lastLevel: level.id,
                lastLives: livesLeft,
                updatedAt: serverTimestamp(),
            },
            { merge: true },
        )
    }, [level.id, user])

    const finishRound = useCallback(async (nextCorrectAnswers: number, totalSecondsRemaining: number, livesLeft: number) => {
        if (isFinishingRound.current) {
            return
        }

        isFinishingRound.current = true
        const finalScore = calculateScore({
            correctAnswers: nextCorrectAnswers,
            lives: livesLeft,
            secondsRemaining: totalSecondsRemaining,
        })

        setCorrectAnswers(nextCorrectAnswers)
        setSecondsRemaining(totalSecondsRemaining)
        setRoundScore(finalScore)
        updateBestScore(finalScore)

        try {
            await syncResultToFirestore(finalScore, livesLeft)
        } catch {
            // Mantener la experiencia local aunque Firestore no esté disponible.
        }

        navigate(`/level-complete/${level.id}`)
    }, [level.id, navigate, setCorrectAnswers, setRoundScore, setSecondsRemaining, syncResultToFirestore, updateBestScore])

    const moveToNextQuestion = useCallback(async (nextCorrectAnswers: number, nextSecondsRemaining: number, livesLeft: number) => {
        const isGameOver = livesLeft <= 0
        const isLastQuestion = questionIndex >= questions.length - 1

        if (isGameOver || isLastQuestion) {
            await finishRound(nextCorrectAnswers, nextSecondsRemaining, livesLeft)
            return
        }

        setQuestionIndex((previous) => previous + 1)
        setTimeLeft(QUESTION_TIME_SECONDS)
        setSelectedAnswer(null)
        setIsResolvingAnswer(false)
    }, [finishRound, questionIndex, questions.length])

    const resolveAnswer = useCallback(async (answer: string | null) => {
        if (!currentQuestion || isResolvingAnswer || isFinishingRound.current) {
            return
        }

        setIsResolvingAnswer(true)

        const isCorrect = answer === currentQuestion.correctAnswer
        const safeAnswer = answer ?? 'timeout'
        const secondsGain = isCorrect ? timeLeft : 0
        const nextCorrectAnswers = isCorrect ? correctAnswersCount + 1 : correctAnswersCount
        const nextSecondsRemaining = accumulatedSeconds + secondsGain
        const nextLives = isCorrect ? progress.lives : Math.max(0, progress.lives - 1)

        setSelectedAnswer(safeAnswer)
        setCorrectAnswersCount(nextCorrectAnswers)
        setAccumulatedSeconds(nextSecondsRemaining)

        if (isCorrect) {
            registerCorrectAnswer()
        } else {
            registerIncorrectAnswer()
        }

        window.setTimeout(() => {
            void moveToNextQuestion(nextCorrectAnswers, nextSecondsRemaining, nextLives)
        }, 450)
    }, [accumulatedSeconds, correctAnswersCount, currentQuestion, isResolvingAnswer, moveToNextQuestion, progress.lives, registerCorrectAnswer, registerIncorrectAnswer, timeLeft])

    useEffect(() => {
        resolveAnswerRef.current = resolveAnswer
    }, [resolveAnswer])

    useEffect(() => () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    return (
        <MobileLayout title="Pantalla de juego" subtitle={`Nivel ${level.label}`}>
            <div className="space-y-4">
                <ScreenCard title="Estado de la ronda" description="15 segundos por pregunta. Si el tiempo llega a cero, cuenta como incorrecta y avanza automáticamente.">
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="rounded-2xl bg-black/5 px-3 py-3 dark:bg-white/5">
                            <p className="text-master-muted">Pregunta</p>
                            <p className="font-bold text-master-primary">{Math.min(questionIndex + 1, level.amount)}/{level.amount}</p>
                        </div>
                        <div className="rounded-2xl bg-black/5 px-3 py-3 dark:bg-white/5">
                            <p className="text-master-muted">Vidas</p>
                            <p className="font-bold text-master-primary">{progress.lives}</p>
                        </div>
                        <div className="rounded-2xl bg-black/5 px-3 py-3 dark:bg-white/5">
                            <p className="text-master-muted">Tiempo</p>
                            <p className="font-bold text-master-primary">{timeLeft}s</p>
                        </div>
                    </div>
                </ScreenCard>

                {isLoading ? (
                    <ScreenCard title="Cargando preguntas" description="Obteniendo trivia real desde Open Trivia DB..." />
                ) : null}

                {!isLoading && error ? (
                    <ScreenCard title="Conexión inestable" description="No se pudo cargar la API. Se usarán preguntas cacheadas o mocks automáticamente." />
                ) : null}

                {!isLoading && currentQuestion ? (
                    <ScreenCard title={currentQuestion.category} description={currentQuestion.question}>
                        <div className="space-y-3">
                            {currentOptions.map((option) => {
                                const isSelected = selectedAnswer === option
                                const isCorrectOption = option === currentQuestion.correctAnswer
                                const showCorrectState = isResolvingAnswer && isCorrectOption
                                const showIncorrectState = isResolvingAnswer && isSelected && !isCorrectOption

                                return (
                                    <button
                                        key={option}
                                        className={[
                                            'w-full rounded-2xl border px-4 py-4 text-left font-semibold transition',
                                            showCorrectState
                                                ? 'border-emerald-400 bg-emerald-100/70 text-emerald-900'
                                                : showIncorrectState
                                                    ? 'border-rose-400 bg-rose-100/70 text-rose-900'
                                                    : 'border-master-border bg-master-surface hover:scale-[1.01]',
                                        ].join(' ')}
                                        disabled={isResolvingAnswer}
                                        onClick={() => {
                                            void resolveAnswer(option)
                                        }}
                                        type="button"
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                    </ScreenCard>
                ) : null}

                {!isLoading && !currentQuestion ? (
                    <ScreenCard title="Sin preguntas" description="No hay preguntas disponibles en este momento. Puedes volver y reintentar." />
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                    <Link className="rounded-2xl border border-master-border bg-master-surface-strong px-4 py-4 text-center font-semibold text-master-primary" to="/levels">
                        Salir
                    </Link>
                    <Link className="rounded-2xl bg-master-primary px-4 py-4 text-center font-semibold text-white" to="/ranking">
                        Ver Ranking
                    </Link>
                </div>
            </div>
        </MobileLayout>
    )
}
