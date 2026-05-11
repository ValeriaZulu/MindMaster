import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameLogic } from '../../hooks/useGameLogic';
import { usePowerUp } from '../../hooks/usePowerUp';
import { useSound } from '../../hooks/useSound';
import { TRIVIA_LEVELS, useTrivia } from '../../hooks/useTrivia';
import type { LevelId } from '../../types/game';

const QUESTION_TIME_SECONDS = 15;

export function GameScreen() {
    const navigate = useNavigate();
    const params = useParams();

    const levelId =
        params.levelId && params.levelId in TRIVIA_LEVELS
            ? (params.levelId as LevelId)
            : 'novato';

    const level = TRIVIA_LEVELS[levelId as keyof typeof TRIVIA_LEVELS];

    const { questions, isLoading, getQuestionsForLevel } = useTrivia();

    const { coins, activateFiftyFifty, activateSkipQuestion } = usePowerUp();

    const { playEffect } = useSound();

    const game = useGameLogic();

    const {
        progress,
        registerCorrectAnswer,
        registerIncorrectAnswer,
        startLevel
    } = game;

    const [questionIndex, setQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SECONDS);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isResolvingAnswer, setIsResolvingAnswer] = useState(false);

    const [usedPowerUps, setUsedPowerUps] = useState({
        fiftyFifty: false,
        skipQuestion: false
    });

    const [displayOptions, setDisplayOptions] = useState<string[]>([]);

    // =========================
    // INICIAR NIVEL CON 3 VIDAS
    // =========================
    useEffect(() => {
        startLevel(levelId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levelId]);

    // =========================
    // CARGAR PREGUNTAS
    // =========================
    useEffect(() => {
        getQuestionsForLevel(levelId);
    }, [levelId, getQuestionsForLevel]);

    const currentQuestion = questions[questionIndex];

    // =========================
    // MEZCLAR OPCIONES
    // =========================
    useEffect(() => {
        if (!currentQuestion) return;

        const allOptions = [
            currentQuestion.correctAnswer,
            ...currentQuestion.incorrectAnswers
        ];

        setDisplayOptions(
            [...allOptions].sort(() => Math.random() - 0.5)
        );
    }, [currentQuestion]);

    // =========================
    // TIMER
    // =========================
    useEffect(() => {
        if (isResolvingAnswer || !currentQuestion) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isResolvingAnswer, currentQuestion]);

    // =========================
    // TIMEOUT
    // =========================
    useEffect(() => {
        if (timeLeft === 0 && !isResolvingAnswer) {
            handleResolveAnswer(null);
        }
    }, [timeLeft, isResolvingAnswer]);

    // =========================
    // RESOLVER RESPUESTA
    // =========================
    const handleResolveAnswer = useCallback(
        async (answer: string | null) => {
            if (!currentQuestion || isResolvingAnswer) return;

            setIsResolvingAnswer(true);

            const isCorrect =
                answer === currentQuestion.correctAnswer;

            // Timeout o incorrecta = -1 vida
            const penalty = isCorrect ? 0 : 1;

            setSelectedAnswer(answer ?? 'timeout');

            if (isCorrect) {
                registerCorrectAnswer();
                playEffect('correct');
            } else {
                registerIncorrectAnswer();
                playEffect('incorrect');
            }

            setTimeout(() => {
                const remainingLives = progress.lives - penalty;

                // =========================
                // SIN VIDAS = DERROTA
                // =========================
                if (remainingLives <= 0) {
                    navigate(`/level-complete/${levelId}`, {
                        replace: true
                    });

                    return;
                }

                // =========================
                // ÚLTIMA PREGUNTA
                // =========================
                if (questionIndex >= questions.length - 1) {
                    navigate(`/level-complete/${levelId}`, {
                        replace: true
                    });

                    return;
                }

                // =========================
                // SIGUIENTE PREGUNTA
                // =========================
                setQuestionIndex((prev) => prev + 1);
                setTimeLeft(QUESTION_TIME_SECONDS);
                setSelectedAnswer(null);
                setIsResolvingAnswer(false);

                setUsedPowerUps({
                    fiftyFifty: false,
                    skipQuestion: false
                });
            }, 1500);
        },
        [
            currentQuestion,
            isResolvingAnswer,
            progress.lives,
            questionIndex,
            questions.length,
            navigate,
            registerCorrectAnswer,
            registerIncorrectAnswer,
            playEffect,
            levelId
        ]
    );

    // =========================
    // LOADING
    // =========================
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-[#8E76FF] border-t-transparent rounded-full animate-spin mb-4"></div>

                <p className="font-bold">
                    Cargando retos...
                </p>
            </div>
        );
    }

    if (!currentQuestion) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[#0B0E14] text-white p-4 font-sans">
            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <span
                            key={i}
                            className={`text-2xl ${i < progress.lives
                                ? ''
                                : 'opacity-20 grayscale'
                                }`}
                        >
                            ❤️
                        </span>
                    ))}
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                        Nivel
                    </p>

                    <p className="text-sm font-black text-[#8E76FF]">
                        {level.label}
                    </p>
                </div>

                <div className="bg-[#1A1D24] px-4 py-1 rounded-full border border-gray-800 flex items-center gap-2">
                    <span className="text-yellow-500">🪙</span>

                    <span className="text-sm font-bold">
                        {coins}
                    </span>
                </div>
            </div>

            {/* TIMER */}
            <div className="w-full h-2 bg-gray-800 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-[#8E76FF]"
                    initial={{ width: '100%' }}
                    animate={{
                        width: `${(timeLeft / QUESTION_TIME_SECONDS) *
                            100
                            }%`
                    }}
                    transition={{
                        duration: 1,
                        ease: 'linear'
                    }}
                />
            </div>

            {/* PREGUNTA */}
            <div className="bg-[#0D1117] rounded-[2.5rem] p-10 border border-gray-800 text-center mb-10 relative flex items-center justify-center shadow-xl">
                <button
                    onClick={() => navigate('/levels')}
                    className="absolute -top-2 -left-2 bg-[#1A1D24] p-2.5 rounded-full border border-gray-700 text-xs"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold leading-tight">
                    {currentQuestion.question}
                </h2>
            </div>

            {/* OPCIONES */}
            <div className="flex-1 space-y-4 mb-32">
                {displayOptions.map((option) => {
                    const isSelected =
                        selectedAnswer === option;

                    const isCorrect =
                        option === currentQuestion.correctAnswer;

                    let btnStyle =
                        'bg-white text-[#0B0E14]';

                    if (isResolvingAnswer) {
                        if (isCorrect) {
                            btnStyle =
                                'bg-green-500 text-white';
                        } else if (isSelected) {
                            btnStyle =
                                'bg-red-500 text-white';
                        } else if (
                            selectedAnswer === 'timeout' &&
                            isCorrect
                        ) {
                            btnStyle =
                                'bg-green-500/50 text-white';
                        }
                    }

                    return (
                        <button
                            key={option}
                            disabled={isResolvingAnswer}
                            onClick={() =>
                                handleResolveAnswer(option)
                            }
                            className={`w-full p-5 rounded-2xl font-black text-left transition-all active:scale-95 shadow-sm ${btnStyle}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {/* POWER UPS */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0B0E14] to-transparent flex gap-4">
                {/* 50/50 */}
                <button
                    onClick={async () => {
                        const res =
                            await activateFiftyFifty({
                                options: displayOptions,
                                correctAnswer:
                                    currentQuestion.correctAnswer,
                                alreadyUsed:
                                    usedPowerUps.fiftyFifty
                            });

                        if (
                            res &&
                            typeof res === 'object' &&
                            'options' in res
                        ) {
                            setDisplayOptions(res.options);

                            setUsedPowerUps((prev) => ({
                                ...prev,
                                fiftyFifty: true
                            }));
                        }
                    }}
                    disabled={
                        isResolvingAnswer ||
                        coins < 40 ||
                        usedPowerUps.fiftyFifty
                    }
                    className="flex-1 bg-[#1A1D24] p-4 rounded-2xl border border-gray-700 flex items-center justify-center gap-3 disabled:opacity-30"
                >
                    <span className="text-[#8E76FF] font-black text-xl">
                        ½
                    </span>

                    <div className="text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1 tracking-tighter">
                            50/50
                        </p>

                        <p className="text-xs font-black text-white leading-none">
                            🪙 40
                        </p>
                    </div>
                </button>

                {/* SKIP */}
                <button
                    onClick={async () => {
                        const success =
                            await activateSkipQuestion({
                                alreadyUsed:
                                    usedPowerUps.skipQuestion
                            });

                        if (success) {
                            setUsedPowerUps((prev) => ({
                                ...prev,
                                skipQuestion: true
                            }));

                            handleResolveAnswer(
                                currentQuestion.correctAnswer
                            );
                        }
                    }}
                    disabled={
                        isResolvingAnswer ||
                        coins < 60 ||
                        usedPowerUps.skipQuestion
                    }
                    className="flex-1 bg-[#1A1D24] p-4 rounded-2xl border border-gray-700 flex items-center justify-center gap-3 disabled:opacity-30"
                >
                    <span className="text-emerald-500 font-black text-xl">
                        ≫
                    </span>

                    <div className="text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1 tracking-tighter">
                            Saltar
                        </p>

                        <p className="text-xs font-black text-white leading-none">
                            🪙 60
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}