import { Outlet } from 'react-router'
import SideBar from './components/SideBar.tsx'
import ReturnMobile from './components/ReturnMobile.tsx';
function App() {
  return (
    <div className="flex flex-col-reverse lg:flex-row w-full h-dvh">
      <SideBar />
      <main className="flex-1 pb-3 px-4 lg:p-12 bg-gray-100 dark:bg-gray-900 overflow-y-scroll">
        <Outlet />
      </main>
      <ReturnMobile />
    </div>
  )
}
export default App
