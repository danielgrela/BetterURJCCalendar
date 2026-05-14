import {NavButtons} from './NavButtons.jsx'
export function SideBar() {
    return (
        <section className="w-full lg:w-70 h-25 lg:h-screen bg-white shadow-md lg:py-12 text-center items-center flex flex-row lg:flex-col">
            <div className='px-4 hidden lg:block'>
                <h1 className="text-3xl font-extrabold text-start text-primary">Better URJC Calendar</h1>
                <p className="text-gray-600 text-start">Un proyecto de Daniel Grela.</p>
            </div>
            <div className='bg-secundario w-full h-px mt-8 mb-4 hidden lg:block'/>
            <NavButtons />
        </section>)
}