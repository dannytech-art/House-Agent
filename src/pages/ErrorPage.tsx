import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
}
export function ErrorPage({
  code = 404,
  title = 'Page Not Found',
  message = "The page you are looking for doesn't exist or has been moved."
}: ErrorPageProps) {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="text-center max-w-md">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl font-bold text-gradient-gold">
              {code}
            </span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-text-primary mb-3">
          {title}
        </h1>
        <p className="text-text-secondary mb-8">{message}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 gold-glow">
            <Home className="w-4 h-4" />
            Go Home
          </button>
          <button onClick={() => navigate('/search')} className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary border border-border-color text-text-primary rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Browse Properties
          </button>
        </div>
      </motion.div>
    </div>;
}