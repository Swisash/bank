import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme'; // הייבוא של הקובץ החדש
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; 
import AppRoutes from './routes/appRoutes'
import './App.css'

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
    <BrowserRouter>
    <div>
        <AppRoutes />
    </div>
    </BrowserRouter>
    </UserProvider> 
    </ThemeProvider>
  )
}

export default App
