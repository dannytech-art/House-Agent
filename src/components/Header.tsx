import React, { useState } from 'react';
import { Moon, Sun, Bell, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
interface HeaderProps {
  onLogoClick?: () => void;
  onProfileClick?: () => void;
  unreadNotifications?: number;
}
export function Header({
  onLogoClick,
  onProfileClick,
  unreadNotifications = 0
}: HeaderProps) {
  const {
    isDark,
    toggleTheme
  } = useTheme();
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    // Force redirect to landing page after logout
    window.location.href = '/';
  };
  return <motion.header initial={{
    y: -20,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-xl border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clickable */}
          <button onClick={onLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/vilanow_001.png" alt="Vilanow" className="h-10 w-auto" />
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gradient-gold-subtle border border-transparent hover:border-primary/30 transition-all" aria-label="Toggle theme">
              {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
            </button>

            {isAuthenticated && <>
                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-gradient-gold-subtle border border-transparent hover:border-primary/30 transition-all relative">
                  <Bell className="w-5 h-5 text-text-secondary" />
                  {unreadNotifications > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-pulse-gold">
                      {unreadNotifications}
                    </span>}
                </button>

                {/* User menu */}
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gradient-gold-subtle border border-transparent hover:border-primary/30 transition-all">
                    {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border-2 border-primary/30" /> : <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                        <User className="w-4 h-4 text-black" />
                      </div>}
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />

                        {/* Menu */}
                        <motion.div initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: -10
                  }} animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: -10
                  }} transition={{
                    duration: 0.15
                  }} className="absolute right-0 mt-2 w-64 bg-bg-primary border border-border-color rounded-xl shadow-2xl overflow-hidden z-50">
                          {/* User Info */}
                          <div className="p-4 border-b border-border-color bg-gradient-gold-subtle">
                            <div className="flex items-center gap-3">
                              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-primary" /> : <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                                  <User className="w-6 h-6 text-black" />
                                </div>}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-text-primary truncate">
                                  {user?.name}
                                </p>
                                <p className="text-xs text-text-tertiary truncate">
                                  {user?.email}
                                </p>
                                <p className="text-xs text-primary font-medium capitalize mt-0.5">
                                  {user?.role}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            <button onClick={() => {
                        setShowUserMenu(false);
                        if (onProfileClick) onProfileClick();
                      }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary transition-colors text-left">
                              <Settings className="w-5 h-5 text-text-tertiary" />
                              <span className="text-sm font-medium text-text-primary">
                                Profile Settings
                              </span>
                            </button>

                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-danger/10 transition-colors text-left group">
                              <LogOut className="w-5 h-5 text-text-tertiary group-hover:text-danger transition-colors" />
                              <span className="text-sm font-medium text-text-primary group-hover:text-danger transition-colors">
                                Logout
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      </>}
                  </AnimatePresence>
                </div>
              </>}
          </div>
        </div>
      </div>
    </motion.header>;
}