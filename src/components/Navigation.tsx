import React from 'react';
import { Home, Search, Heart, Wallet, User, LayoutDashboard, MessageCircle, Store, FileText, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({
  currentPage,
  onNavigate
}: NavigationProps) {
  const {
    isAgent
  } = useAuth();

  const seekerNavItems = [{
    id: 'home',
    icon: Home,
    label: 'Home'
  }, {
    id: 'search',
    icon: Search,
    label: 'Search'
  }, {
    id: 'requests',
    icon: FileText,
    label: 'Requests'
  }, {
    id: 'watchlist',
    icon: Heart,
    label: 'Saved'
  }, {
    id: 'chats',
    icon: MessageCircle,
    label: 'Chats'
  }];

  const agentNavItems = [{
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    id: 'marketplace',
    icon: Store,
    label: 'Market'
  }, {
    id: 'my-listings',
    icon: Building2,
    label: 'My Listings'
  }, {
    id: 'chats',
    icon: MessageCircle,
    label: 'Chats'
  }, {
    id: 'wallet',
    icon: Wallet,
    label: 'Wallet'
  }, {
    id: 'profile',
    icon: User,
    label: 'Profile'
  }];

  const navItems = isAgent ? agentNavItems : seekerNavItems;

  // Map dashboard to home for seekers
  const activeId = currentPage === 'dashboard' && !isAgent ? 'home' : currentPage;

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-xl border-t border-primary/20 safe-area-bottom"
    >
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id === 'home' ? 'dashboard' : item.id)}
                className="flex flex-col items-center justify-center gap-1 px-2 py-2 relative group"
              >
                <Icon className={`w-5 h-5 transition-all ${isActive ? 'text-primary scale-110' : 'text-text-tertiary group-hover:text-primary'}`} />
                <span className={`text-[9px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-text-tertiary group-hover:text-primary'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-gold rounded-full gold-glow"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
