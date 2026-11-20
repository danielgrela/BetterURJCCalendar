import { Outlet } from 'react-router'
import SideBar from './components/SideBar.tsx'
import ReturnMobile from './components/ReturnMobile.tsx';
import Avisos from './components/Avisos.tsx';
function App() {
  return (
    <div className="flex flex-col-reverse lg:flex-row w-full h-dvh">
      <SideBar />
      <main className="flex-1 pb-3 px-4 lg:p-12 bg-lienzo overflow-y-auto">
        <Outlet />
      </main>
      <ReturnMobile />
      <Avisos />
    </div>
  )
}
export default App
