import { AppRouter } from './app/router'
import { useTheme } from './hooks/useTheme'

function App() {
  useTheme()

  return (
    <AppRouter />
  )
}

export default App
