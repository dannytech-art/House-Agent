import React from 'react';
import { motion } from 'framer-motion';
import { PromptSearchBar } from '../components/PromptSearchBar';
import { PropertyTicker } from '../components/PropertyTicker';
import { Home, Zap, Shield, TrendingUp, Sparkles } from 'lucide-react';
interface LandingPageProps {
  onSearch: (query: string) => void;
  onOpenLoginModal: () => void;
  onOpenSignupModal: () => void;
}
export function LandingPage({
  onSearch,
  onOpenLoginModal,
  onOpenSignupModal
}: LandingPageProps) {
  const features = [{
    icon: Zap,
    title: 'Instant Matches',
    description: 'AI-powered search finds your perfect home in seconds'
  }, {
    icon: Shield,
    title: 'Verified Agents',
    description: 'Connect with trusted, KYC-verified property agents'
  }, {
    icon: TrendingUp,
    title: 'Live Listings',
    description: 'Real-time updates on the hottest properties in Lagos'
  }];
  return <div className="min-h-screen bg-bg-primary">
      {/* Hero Section with Cinematic Background */}
      <div className="relative min-h-[85vh] flex items-center">
        {/* Dark Cinematic Background - Only show in dark mode */}
        <div className="absolute inset-0 z-0 dark:block hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-bg-primary z-10"></div>
          <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80" alt="Lagos Skyline" className="w-full h-full object-cover opacity-40" />
          {/* Gold overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 z-10"></div>
        </div>

        {/* Light mode gradient background */}
        <div className="absolute inset-0 z-0 light:block dark:hidden bg-gradient-to-b from-bg-secondary via-bg-primary to-bg-primary"></div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-12">
            {/* Premium Badge */}
            <motion.div initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-gold-subtle border border-primary/30 rounded-full mb-8 gold-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Lagos' Premier Property Platform
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3,
            duration: 0.8
          }} className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary mb-6 text-balance leading-tight">
              <br />
              <span className="text-gradient-gold">Just type your need.</span>
            </motion.h1>

            <motion.p initial={{
            opacity: 0
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.5,
            duration: 0.8
          }} className="text-xl text-text-secondary max-w-2xl mx-auto mb-12 text-balance">
              Skip the endless scrolling. Tell us what you want, and we'll match
              you with the perfect property instantly.
            </motion.p>

            {/* Search Bar */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.7,
            duration: 0.8
          }}>
              <PromptSearchBar onSearch={onSearch} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.9,
            duration: 0.8
          }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button onClick={onOpenSignupModal} className="px-8 py-4 bg-gradient-gold hover:opacity-90 text-black font-semibold rounded-xl transition-all gold-glow">
                Get Started
              </button>
              <button onClick={onOpenLoginModal} className="px-8 py-4 bg-transparent border-2 border-primary/50 hover:border-primary text-text-primary rounded-xl font-semibold transition-all hover:gold-glow">
                Sign In
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Live Ticker */}
      <PropertyTicker />

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Why <span className="text-gradient-gold">Vilanow</span>?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            The fastest, smartest way to find and secure premium properties in
            Lagos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.15,
            duration: 0.6
          }} className="premium-card p-8">
                <div className="w-14 h-14 bg-gradient-gold-subtle rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>;
        })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-gold-subtle border-y border-primary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{
            label: 'Active Listings',
            value: '2,500+'
          }, {
            label: 'Verified Agents',
            value: '500+'
          }, {
            label: 'Happy Clients',
            value: '10,000+'
          }, {
            label: 'Areas Covered',
            value: '50+'
          }].map((stat, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1,
            duration: 0.5
          }} className="text-center">
                <div className="font-display text-5xl font-bold text-gradient-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary font-medium">
                  {stat.label}
                </div>
              </motion.div>)}
          </div>
        </div>
      </div>
    </div>;
}