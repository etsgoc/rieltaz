import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, LogOut, MessageSquare, Settings, Ticket, Handshake } from 'lucide-react';
import { db } from '@/lib/supabase';
import Logo from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/deals', label: 'Property deals', icon: Handshake },
  { to: '/orders', label: 'Service orders', icon: Ticket },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Shell() {
  return (
    <div className="shell">
      <aside className="side">
        <Logo />
        <nav>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}><Icon size={18} /><span>{label}</span></NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <ThemeToggle />
          <button className="btn btn-ghost btn-md" onClick={() => db.auth.signOut()}><LogOut size={16} />Sign out</button>
        </div>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}
