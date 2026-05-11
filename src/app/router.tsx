import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CreditsScreen } from '../features/credits/CreditsScreen'
import { GameScreen } from '../features/game/GameScreen'
import { HomeScreen } from '../features/home/HomeScreen'
import { LevelCompleteScreen } from '../features/level-complete/LevelCompleteScreen'
import { LevelsScreen } from '../features/levels/LevelsScreen'
import { RankingScreen } from '../features/ranking/RankingScreen'
import { SettingsScreen } from '../features/settings/SettingsScreen'
import { SocialScreen } from '../features/social/SocialScreen'
import { SplashScreen } from '../features/splash/SplashScreen'

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/splash" />} />
                <Route path="/splash" element={<SplashScreen />} />
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/levels" element={<LevelsScreen />} />
                <Route path="/game/:levelId" element={<GameScreen />} />
                <Route path="/level-complete/:levelId" element={<LevelCompleteScreen />} />
                <Route path="/ranking" element={<RankingScreen />} />
                <Route path="/social" element={<SocialScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="/profile" element={<SettingsScreen />} />
                <Route path="/credits" element={<CreditsScreen />} />
                <Route path="*" element={<Navigate replace to="/splash" />} />
            </Routes>
        </BrowserRouter>
    )
}