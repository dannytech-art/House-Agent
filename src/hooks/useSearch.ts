import { useState, useCallback, useEffect } from 'react';
import { Property, PropertyType } from '../types';
import apiClient from '../lib/api-client';

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType | 'all';
  location?: string;
  amenities?: string[];
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    propertyType: 'all'
  });
  const [results, setResults] = useState<Property[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from local storage
  useEffect(() => {
    const saved = localStorage.getItem('vilanow_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const parseQuery = (input: string): Partial<SearchFilters> => {
    const parsed: Partial<SearchFilters> = {};
    const lowerInput = input.toLowerCase();

    // Mock natural language parsing
    if (lowerInput.includes('bedroom') || lowerInput.includes('bed')) {
      const match = lowerInput.match(/(\d+)\s*(?:bedroom|bed)/);
      if (match) parsed.bedrooms = parseInt(match[1]);
    }
    if (lowerInput.includes('apartment')) parsed.propertyType = 'apartment';
    if (lowerInput.includes('house')) parsed.propertyType = 'house';
    if (lowerInput.includes('duplex')) parsed.propertyType = 'duplex';
    if (lowerInput.includes('land')) parsed.propertyType = 'land';
    if (lowerInput.includes('lekki')) parsed.location = 'Lekki';
    if (lowerInput.includes('ikate')) parsed.location = 'Ikate';
    if (lowerInput.includes('ajah')) parsed.location = 'Ajah';
    return parsed;
  };

  const search = useCallback(async (searchQuery: string, activeFilters: SearchFilters = filters) => {
    setIsSearching(true);
    setQuery(searchQuery);

    // Save to history
    if (searchQuery.trim()) {
      setRecentSearches(prev => {
        const newHistory = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        localStorage.setItem('vilanow_recent_searches', JSON.stringify(newHistory));
        return newHistory;
      });
    }

    try {
      const parsedQuery = parseQuery(searchQuery);
      const effectiveFilters = {
        ...activeFilters,
        ...parsedQuery
      };

      // Build API params
      const params: Record<string, any> = {};
      
      if (effectiveFilters.location) {
        params.location = effectiveFilters.location;
      }
      if (effectiveFilters.propertyType && effectiveFilters.propertyType !== 'all') {
        params.type = effectiveFilters.propertyType;
      }
      if (effectiveFilters.minPrice) {
        params.minPrice = effectiveFilters.minPrice;
      }
      if (effectiveFilters.maxPrice) {
        params.maxPrice = effectiveFilters.maxPrice;
      }

      // Fetch from API
      const properties = await apiClient.getProperties(params);
      
      // Additional client-side filtering if needed
      let filtered = Array.isArray(properties) ? properties : [];
      
      // Text match (client-side for now)
      if (searchQuery) {
        filtered = filtered.filter(property => 
          property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Bedrooms filter (client-side)
      if (effectiveFilters.bedrooms) {
        filtered = filtered.filter(property => 
          (property.bedrooms || 0) >= effectiveFilters.bedrooms!
        );
      }

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      // Set empty results on error
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  // Load all properties on initial mount
  useEffect(() => {
    search('');
  }, []);

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('vilanow_recent_searches');
  };

  return {
    query,
    filters,
    results,
    isSearching,
    recentSearches,
    setFilters,
    search,
    clearHistory
  };
}
