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
createRoot(document.getElementById('root')).render(
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
)
