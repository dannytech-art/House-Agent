import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { AgentDashboardPage } from './pages/AgentDashboardPage';
import { SeekerDashboardPage } from './pages/SeekerDashboardPage';
import { PublicAgentProfilePage } from './pages/PublicAgentProfilePage';
import { AgentMarketplacePage } from './pages/AgentMarketplacePage';
import { WalletPage } from './pages/WalletPage';
import { InterestsPage } from './pages/InterestsPage';
import { QuestsPage } from './pages/QuestsPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AddListingPage } from './pages/AddListingPage';
import { ChatsPage } from './pages/ChatsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { TerritoriesPage } from './pages/TerritoriesPage';
import { AgentKYCOnboardingPage } from './pages/AgentKYCOnboardingPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SeekerRequestsPage } from './pages/SeekerRequestsPage';
import { SwipePage } from './pages/SwipePage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { HelpPage } from './pages/HelpPage';
import { ErrorPage } from './pages/ErrorPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginModal } from './components/LoginModal';
import { SignupModal } from './components/SignupModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { NotificationToast } from './components/NotificationToast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { useRealTime } from './hooks/useRealTime';
import { useSearch } from './hooks/useSearch';
import { mockProperties, mockAgent } from './utils/mockData';
import { Property } from './types';
function AppContent() {
  const {
    user,
    isAuthenticated,
    isAgent,
    needsKYC
  } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isSeeker = user?.role === 'seeker';
  const {
    notifications,
    unreadCount,
    markAsRead
  } = useRealTime();
  const {
    search,
    results
  } = useSearch();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);
  // Auth Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  // Redirect to dashboard after login - simplified and more reliable
  useEffect(() => {
    if (isAuthenticated && currentPage === 'landing') {
      // Small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        setCurrentPage('dashboard');
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, currentPage]);
  // Redirect to landing after logout
  useEffect(() => {
    if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'terms' && currentPage !== 'privacy' && currentPage !== 'help') {
      setCurrentPage('landing');
    }
  }, [isAuthenticated, currentPage]);
  // Redirect to KYC if needed
  useEffect(() => {
    if (needsKYC && currentPage !== 'kyc-onboarding') {
      setCurrentPage('kyc-onboarding');
    }
  }, [needsKYC, currentPage]);
  const handleSearch = (query: string) => {
    search(query);
    setCurrentPage('search');
  };
  const handleStartSwipe = () => {
    search('');
    setCurrentPage('swipe');
  };
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPage('property-details');
  };
  const handleSaveProperty = (property: Property) => {
    setSavedProperties(prev => {
      if (prev.find(p => p.id === property.id)) {
        return prev;
      }
      return [...prev, property];
    });
  };
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };
  const handleLogoClick = () => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('landing');
    }
  };
  const handleProfileClick = () => {
    setCurrentPage('profile');
  };
  const handleViewAgentProfile = (agentId: string) => {
    setViewingAgentId(agentId);
    setCurrentPage('public-agent-profile');
  };
  const handleExpressInterestFromPublicProfile = (property: Property) => {
    alert(`Interest expressed in ${property.title}!\n\nThe agent will contact you soon.`);
  };
  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setShowForgot(false);
  };
  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setShowForgot(false);
  };
  const openForgot = () => {
    setShowForgot(true);
    setShowLogin(false);
    setShowSignup(false);
  };
  const closeAll = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgot(false);
    // Force navigation check after modal closes
    setTimeout(() => {
      if (isAuthenticated && currentPage === 'landing') {
        setCurrentPage('dashboard');
      }
    }, 150);
  };
  const renderPage = () => {
    const path = window.location.pathname;
    if (path === '/reset-password') return <ResetPasswordPage />;
    if (path === '/terms') return <TermsPage />;
    if (path === '/privacy') return <PrivacyPage />;
    if (path === '/help') return <HelpPage />;
    if (path === '/admin' || currentPage === 'admin') {
      if (!isAdmin) {
        return <ErrorPage />;
      }
      return <AdminDashboardPage />;
    }
    switch (currentPage) {
      case 'landing':
        return <LandingPage onSearch={handleSearch} onOpenLoginModal={openLogin} onOpenSignupModal={openSignup} />;
      case 'swipe':
        return <SwipePage properties={results.length > 0 ? results : mockProperties} onBack={() => setCurrentPage(isAuthenticated ? 'dashboard' : 'landing')} onPropertyClick={handlePropertyClick} onSaveProperty={handleSaveProperty} />;
      case 'search':
        return <SearchResultsPage properties={results.length > 0 ? results : mockProperties} onBack={() => setCurrentPage(isAuthenticated ? 'dashboard' : 'landing')} onPropertyClick={handlePropertyClick} onSaveProperty={handleSaveProperty} />;
      case 'property-details':
        return selectedProperty ? <PropertyDetailsPage property={selectedProperty} onBack={() => setCurrentPage('search')} onExpressInterest={() => {
          alert('Interest expressed! Agent will contact you soon.');
          setCurrentPage('search');
        }} /> : null;
      case 'public-agent-profile':
        return viewingAgentId ? <PublicAgentProfilePage agentId={viewingAgentId} onBack={() => setCurrentPage(isAuthenticated ? 'dashboard' : 'landing')} onExpressInterest={handleExpressInterestFromPublicProfile} /> : null;
      case 'marketplace':
        return isAgent && user ? <AgentMarketplacePage currentUserId={user.id} currentCredits={(user as typeof mockAgent).credits} onBack={() => setCurrentPage('dashboard')} /> : null;
      case 'dashboard':
      case 'home':
        if (isAdmin) {
          return <AdminDashboardPage />;
        }
        if (isAgent && user) {
          return <AgentDashboardPage agent={user as typeof mockAgent} onNavigate={handleNavigate} />;
        } else if (isAuthenticated) {
          return <SeekerDashboardPage onNavigate={handleNavigate} onStartSwipe={handleStartSwipe} savedProperties={savedProperties} />;
        }
        return null;
      case 'wallet':
        return <WalletPage />;
      case 'interests':
        return <InterestsPage />;
      case 'quests':
        return <QuestsPage />;
      case 'watchlist':
        return <WatchlistPage />;
      case 'add-listing':
        return <AddListingPage />;
      case 'chats':
        return <ChatsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'my-listings':
        return <MyListingsPage />;
      case 'territories':
        return <TerritoriesPage />;
      case 'kyc-onboarding':
        return <AgentKYCOnboardingPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'requests':
        return <SeekerRequestsPage />;
      case 'viewings':
        return <div className="min-h-screen bg-bg-secondary flex items-center justify-center pb-20">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                Scheduled Viewings
              </h2>
              <p className="text-text-secondary mb-4">
                This page is under construction
              </p>
              <button onClick={() => setCurrentPage('dashboard')} className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors">
                Go Back
              </button>
            </div>
          </div>;
      default:
        return <ErrorPage />;
    }
  };
  return <div className="min-h-screen bg-bg-primary">
      <Header onLogoClick={handleLogoClick} onProfileClick={handleProfileClick} unreadNotifications={unreadCount} />

      <ErrorBoundary>{renderPage()}</ErrorBoundary>

      {isAuthenticated && !isAdmin && currentPage !== 'kyc-onboarding' && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}

      <NotificationToast notifications={notifications} onDismiss={markAsRead} />

      <LoginModal isOpen={showLogin} onClose={closeAll} onOpenSignup={openSignup} onOpenForgotPassword={openForgot} />
      <SignupModal isOpen={showSignup} onClose={closeAll} onOpenLogin={openLogin} />
      <ForgotPasswordModal isOpen={showForgot} onClose={closeAll} onOpenLogin={openLogin} />
    </div>;
}
export function App() {
  return <Router>
      <AppContent />
    </Router>;
}