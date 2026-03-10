'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useTheme } from '../hooks/useTheme';
import Avatar from './Avatar';
import {
  Home,
  User,
  Briefcase,
  MessageCircle,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { logOut } from '../services/auth';

export default function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { profile } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);

  if (!isLoggedIn) return null;

  const isEmployer = profile?.role === 'employer';
  const homeRoute = isEmployer ? '/employer-home' : '/home';

  const navItems = [
    { href: homeRoute, icon: Home, label: 'Home' },
    { href: '/profile-setup', icon: User, label: 'Profile' },
    { href: isEmployer ? '/employer-browse' : '/career-manager', icon: Briefcase, label: isEmployer ? 'Candidates' : 'Career' },
    { href: '/inbox', icon: MessageCircle, label: 'Messages' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass-card-elevated border-b border-border h-16 items-center px-6">
        <Link href={homeRoute} className="flex items-center gap-2 mr-8">
          <span className="text-xl font-bold gradient-text">MyFutureCareer</span>
        </Link>

        <div className="flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                  ${active ? 'bg-primary-muted text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'}
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-bg-card text-text-secondary transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {profile && (
            <Link href="/profile-setup">
              <Avatar index={profile.avatar || 0} size={36} />
            </Link>
          )}
          <button onClick={() => logOut()} className="p-2 rounded-lg hover:bg-bg-card text-text-secondary transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card-elevated border-b border-border h-14 flex items-center px-4 justify-between">
        <Link href={homeRoute} className="text-lg font-bold gradient-text">MFC</Link>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-text-primary">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-bg/95 pt-14">
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-colors
                    ${active ? 'bg-primary-muted text-primary' : 'text-text-secondary hover:text-text-primary'}
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <hr className="border-border my-2" />
            <button onClick={toggleTheme} className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={() => { logOut(); setMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-error"
            >
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 md:h-16" />
    </>
  );
}
