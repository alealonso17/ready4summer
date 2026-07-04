import { NavLink } from 'react-router-dom'
import { FiHome, FiCalendar, FiEdit3 } from 'react-icons/fi'

const navItems = [
    { to: '/home', label: 'Home', icon: FiHome, end: true },
    { to: '/hoy', label: 'Hoy', icon: FiCalendar },
    { to: '/registro', label: 'Registro', icon: FiEdit3 },
]

export default function NavBar() {
    return (
        <nav className="glass-nav mx-4 mb-4 rounded-2xl px-2 py-2">
            <ul className="flex items-center justify-around">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `glass-nav-item flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium ${
                                    isActive
                                        ? 'glass-nav-active text-[#016D49]'
                                        : 'text-[#4F5F5A] hover:text-[#0B1F16]'
                                }`
                            }
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
