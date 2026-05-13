import {NavButtons} from './NavButtons.jsx'
export function SideBar() {
    return (
        <section className="w-70 h-screen bg-white shadow-md py-12 text-center flex flex-col">
            <div className='px-4'>
                <h1 className="text-3xl font-extrabold text-start text-primary">Better URJC Calendar</h1>
                <p className="text-gray-600 text-start">Un proyecto de Daniel Grela.</p>
            </div>
            <div className='bg-secundario w-full h-px mt-8 mb-4'/>
            <NavButtons />
        </section>)
}