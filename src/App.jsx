import { Outlet } from 'react-router-dom'
import { SideBar } from './components/SideBar.jsx'

function App() {
  return (
    <main className="flex flex-row w-full h-screen">
      <SideBar />
      <main className="flex-1 p-12 bg-gray-100">
        <Outlet />
      </main>
    </main>
  )
}
export default App
