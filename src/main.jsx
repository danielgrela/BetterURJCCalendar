import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HomePage from './components/HomePage.jsx'
import CalendarPage from './components/CalendarPage.jsx'
import ImportPage from './components/ImportPage.jsx'
import HeroPage from './components/HeroPage.jsx'
import UseGuide from './components/UseGuide.jsx'
import NotFound from './components/NotFound.jsx'
import useDarkMode from './hooks/useDarkMode.js';
import ToggleThemeButton from './components/ToggleThemeButton.jsx'

const Root = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/dashboard" element={<App />}>
            <Route path="" element={<HomePage />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="importar" element={<ImportPage />} />
            <Route path="guia-de-uso" element={<UseGuide />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToggleThemeButton className="fixed hidden lg:block bottom-8 right-8" />
    </>
  );
};
createRoot(document.getElementById('root')).render(<Root />)
