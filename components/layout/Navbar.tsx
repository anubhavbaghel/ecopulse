'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  User,
  Settings,
} from 'lucide-react';

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/log', label: 'Log', icon: PenLine },
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* ── Mobile Top Bar ─────────────────────────────────────────────── */}
      <header className="mobile-only fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">
            EcoPulse
          </span>
        </div>
        <div className="flex items-center gap-3">
           {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Your profile photo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-emerald-500/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 border border-zinc-200">
                <User size={16} />
              </div>
            )}
        </div>
      </header>

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside className="desktop-only fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-zinc-200 z-40 flex flex-col">
        {/* Brand */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <Leaf size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-zinc-900">EcoPulse</h1>
              <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Climate Companion</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={`Navigate to ${label}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive(href)
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors ${
                    isActive(href) ? 'text-emerald-600' : 'text-zinc-400 group-hover:text-zinc-900'
                  }`}
                />
                <span className="font-medium">{label}</span>
                {isActive(href) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Workspace */}
        <div className="mt-auto p-6 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3 mb-4">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Your profile photo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 border-2 border-white shadow-sm">
                <User size={20} />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold text-zinc-900 truncate">
                {profile?.archetype || user?.displayName || 'Eco Explorer'}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button aria-label="Settings" className="flex items-center justify-center p-2 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-all">
              <Settings size={18} />
            </button>
            <button
              aria-label="Sign out"
              onClick={handleSignOut}
              className="flex items-center justify-center p-2 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ────────────────────────────────────── */}
      <nav className="mobile-only fixed bottom-0 left-0 right-0 h-20 glass border-t border-zinc-200 z-50 flex items-center justify-around px-2 pb-safe">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex flex-col items-center gap-1 px-4 transition-all duration-200 ${
              isActive(href) ? 'text-emerald-600' : 'text-zinc-400'
            }`}
          >
            <div className={`p-2 rounded-xl transition-all ${isActive(href) ? 'bg-emerald-100/50' : ''}`}>
              <Icon size={24} strokeWidth={isActive(href) ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

