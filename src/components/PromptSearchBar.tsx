import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface PromptSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  recentSearches?: string[];
}
export function PromptSearchBar({
  onSearch,
  placeholder,
  recentSearches = []
}: PromptSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const examples = ['3-bedroom in Ikate for 12M', '2-bedroom flat in Ajah under 10M', 'Duplex in Lekki with pool', 'Penthouse in VI with ocean view'];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowHistory(false);
    }
  };
  return <div className="w-full max-w-3xl mx-auto relative z-30">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div animate={{
        scale: isFocused ? 1.02 : 1
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }} className={`relative flex items-center bg-bg-secondary/80 backdrop-blur-sm rounded-2xl border-2 transition-all ${isFocused ? 'border-primary gold-glow' : 'border-primary/30'}`}>
          <Sparkles className={`absolute left-5 w-5 h-5 transition-colors ${isFocused ? 'text-primary' : 'text-text-tertiary'}`} />

          <input type="text" value={query} onChange={e => setQuery(e.target.value)} onFocus={() => {
          setIsFocused(true);
          setShowHistory(true);
        }} onBlur={() => {
          setIsFocused(false);
          setTimeout(() => setShowHistory(false), 200);
        }} placeholder={placeholder || 'I need a 3-bedroom in Ikate for 12M...'} className="w-full pl-14 pr-32 py-5 bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none text-base font-medium" />

          <button type="submit" className="absolute right-2 px-6 py-3 bg-gradient-gold hover:opacity-90 text-black rounded-xl font-bold transition-all flex items-center gap-2 gold-glow">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </motion.div>
      </form>

      {/* Search History Dropdown */}
      <AnimatePresence>
        {showHistory && recentSearches.length > 0 && <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-color rounded-xl shadow-xl overflow-hidden">
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-bold text-text-tertiary uppercase tracking-wider">
                Recent Searches
              </p>
              {recentSearches.map((search, index) => <button key={index} onClick={() => {
            setQuery(search);
            onSearch(search);
          }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-bg-tertiary rounded-lg transition-colors text-left">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-primary">{search}</span>
                </button>)}
            </div>
          </motion.div>}
      </AnimatePresence>

      {/* Example prompts */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {examples.map((example, index) => <motion.button key={index} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }} onClick={() => {
        setQuery(example);
        onSearch(example);
      }} className="px-4 py-2 text-sm bg-bg-secondary/50 hover:bg-gradient-gold-subtle border border-primary/20 hover:border-primary/50 text-text-secondary hover:text-primary rounded-full transition-all">
            {example}
          </motion.button>)}
      </div>
    </div>;
}