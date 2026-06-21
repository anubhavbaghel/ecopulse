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
        <div className="flex items-center gap-2.5 px-1 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(107, 143, 113, 0.15)', border: '1px solid rgba(107, 143, 113, 0.25)' }}
          >
            <Leaf size={16} style={{ color: 'var(--color-sage-400)' }} />
          </div>
          <span className="font-semibold tracking-tight" style={{ color: 'var(--color-cream-100)', fontSize: '1rem' }}>
            <span style={{ color: 'var(--color-sage-400)' }}>Eco</span>Pulse
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User / Sign-out */}
        {user && (
          <div className="mt-auto pt-4" style={{ borderTop: '1px solid rgba(107, 143, 113, 0.1)' }}>
            <div className="flex items-center gap-2.5 px-1 mb-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ border: '1.5px solid rgba(107, 143, 113, 0.25)' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ background: 'var(--color-sage-800)', color: 'var(--color-sage-300)' }}
                >
                  {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--color-cream-200)', maxWidth: '140px' }}
                >
                  {profile?.archetype ?? user.displayName ?? 'Welcome'}
                </span>
                <span className="text-xs truncate" style={{ color: 'var(--color-cream-500)', maxWidth: '140px' }}>
                  {user.email}
                </span>
              </div>
            </div>
            <button onClick={handleSignOut} className="nav-link w-full" style={{ color: 'var(--color-cream-500)' }}>
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* ── Mobile Bottom Nav ────────────────────────────────────────────── */}
      <nav className="bottom-nav">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all"
              style={{
                color: isActive ? 'var(--color-sage-400)' : 'var(--color-cream-500)',
                background: isActive ? 'rgba(107, 143, 113, 0.12)' : 'transparent',
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: '0.65rem', fontWeight: 500 }}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
