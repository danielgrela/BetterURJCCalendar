import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar.jsx'
import ReturnMobile from './components/ReturnMobile.jsx';
function App() {
  return (
    <main className="flex flex-col-reverse lg:flex-row w-full h-dvh">
      <SideBar />
      <main className="flex-1 pb-3 px-4 lg:p-12 bg-gray-100 dark:bg-gray-900 overflow-y-scroll">
        <Outlet />
      </main>
      <ReturnMobile />
    </main>
  )
}
export default App
