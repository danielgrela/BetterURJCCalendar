import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar.jsx'
import ToggleThemeButton from './components/ToggleThemeButton.jsx';
function App() {
  return (
    <main className="flex flex-col-reverse lg:flex-row w-full h-dvh">
      <SideBar />
      <main className="flex-1 pt-8 pb-3 lg:p-12 bg-gray-100 dark:bg-gray-900 overflow-y-scroll">
        <Outlet />
      </main>
      <ToggleThemeButton className="block lg:hidden top-8 right-8" />
    </main>
  )
}
export default App
