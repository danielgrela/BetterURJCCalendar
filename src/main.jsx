import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HomePage } from './components/HomePage.jsx'
import { CalendarPage } from './components/CalendarPage.jsx'
import { ImportPage } from './components/ImportPage.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<App />}>
         <Route path="" element={<HomePage />} />
         <Route path="calendario" element={<CalendarPage />} />
         <Route path="importar" element={<ImportPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
