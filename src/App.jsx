import { Outlet } from 'react-router-dom'
import { SideBar } from './components/SideBar.jsx'

function App() {
  return (
    <main className="flex flex-col-reverse lg:flex-row w-full h-dvh">
      <SideBar />
      <main className="flex-1 py-8 lg:p-12 bg-gray-100 overflow-y-scroll">
        <Outlet />
      </main>
    </main>
  )
}
export default App
