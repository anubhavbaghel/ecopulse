'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/stores/authStore';
import {
  LayoutDashboard,
  PenLine,
  CheckSquare,
  Repeat2,
  LogOut,
  Leaf,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/log', label: 'Log Activity', icon: PenLine },
  { href: '/habits', label: 'Habits', icon: CheckSquare },
  { href: '/swaps', label: 'Swaps', icon: Repeat2 },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, user } = useAuthStore();

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/');
  };

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 mb-6">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: '#e8f0fe', border: '1px solid #d2e3fc' }}
          >
            <Leaf size={14} style={{ color: '#1a73e8' }} />
          </div>
          <span className="font-semibold tracking-tight" style={{ color: '#202124', fontSize: '1rem' }}>
            <span style={{ color: '#1a73e8' }}>Eco</span>Pulse
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-0.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Sign-out */}
        {user && (
          <div className="mt-auto pt-4 px-4" style={{ borderTop: '1px solid #dadce0' }}>
            <div className="flex items-center gap-2.5 mb-3 px-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ border: '1px solid #dadce0' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: '#e8f0fe', color: '#1a73e8' }}
                >
                  {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span
                  className="text-xs font-semibold truncate"
                  style={{ color: '#202124', maxWidth: '140px' }}
                >
                  {profile?.archetype ?? user.displayName ?? 'Welcome'}
                </span>
                <span className="text-[10px] truncate" style={{ color: '#5f6368', maxWidth: '140px' }}>
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="nav-link w-full rounded hover:bg-gray-100 py-2 px-2.5 flex items-center gap-2 justify-start cursor-pointer"
              style={{ color: '#5f6368', borderLeft: 'none', paddingLeft: '0.5rem' }}
            >
              <LogOut size={14} />
              <span className="text-xs">Sign out</span>
            </button>
          </div>
        )}
      </aside>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────────── */}
      <nav className="bottom-nav flex justify-around items-center">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-1 transition-all cursor-pointer"
              style={{
                color: isActive ? '#1a73e8' : '#5f6368',
              }}
            >
              <div
                className={`flex items-center justify-center px-4.5 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[#e8f0fe]' : 'bg-transparent hover:bg-gray-100/50'
                }`}
              >
                <Icon size={18} style={{ color: isActive ? '#1a73e8' : '#5f6368' }} />
              </div>
              <span className="mt-1 block" style={{ fontSize: '0.65rem', fontWeight: isActive ? 600 : 500 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
