'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Button from '@/components/ui/Button';

const USER_LINKS = [
  { href: '/dashboard',        label: '🏠 Home' },
  { href: '/dashboard/report', label: '🆘 Report' },
  { href: '/dashboard/track',  label: '📋 My Reports' },
];

const ADMIN_LINKS = [
  { href: '/admin',               label: '📊 Dashboard' },
  { href: '/admin/emergencies',   label: '🗂 All Emergencies' },
];

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const links = currentUser?.role === 'admin' ? ADMIN_LINKS : USER_LINKS;

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <nav className="h-14 bg-black border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="text-xl">🚨</span>
        <span className="font-bold text-lg tracking-wider text-white">ERCS</span>
        {currentUser?.role === 'admin' && (
          <span className="bg-orange-900 text-orange-300 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Admin
          </span>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${pathname === l.href
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* User + Logout */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 hidden sm:block">
          {currentUser?.name}
        </span>
        <Button variant="ghost" onClick={handleLogout} className="text-xs px-3 py-1.5">
          Logout
        </Button>
      </div>
    </nav>
  );
}
