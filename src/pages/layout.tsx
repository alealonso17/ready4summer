import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'


export default function Layout() {
    return (
        <div className="min-h-screen pb-24">
            <Outlet />
            <div className="fixed bottom-0 left-0 right-0 z-20">
                <NavBar />
            </div>
        </div>
    )
}