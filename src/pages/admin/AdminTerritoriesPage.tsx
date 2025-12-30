import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, TrendingUp, Users, Crown, Search, Building2, Star, Edit, Award } from 'lucide-react';
import { mockLeaderboardAgents } from '../../utils/mockData';

interface Territory {
  name: string;
  agents: number;
  dominance: number;
  leader: string;
  growth: string;
  listings: number;
  avgRating: number;
  topAgents: string[];
}

export function AdminTerritoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const territories: Territory[] = [
    {
      name: 'Lekki',
      agents: 45,
      dominance: 85,
      leader: 'Chidi Okafor',
      growth: '+12%',
      listings: 234,
      avgRating: 4.8,
      topAgents: ['Chidi Okafor', 'Fatima Ibrahim', 'Emeka Nnamdi']
    },
    {
      name: 'Victoria Island',
      agents: 38,
      dominance: 78,
      leader: 'Fatima Ibrahim',
      growth: '+8%',
      listings: 189,
      avgRating: 4.7,
      topAgents: ['Fatima Ibrahim', 'Ngozi Eze', 'Tunde Adebayo']
    },
    {
      name: 'Ikeja',
      agents: 52,
      dominance: 72,
      leader: 'Emeka Nnamdi',
      growth: '+15%',
      listings: 312,
      avgRating: 4.6,
      topAgents: ['Emeka Nnamdi', 'Chidi Okafor', 'Kemi Adeyemi']
    },
    {
      name: 'Yaba',
      agents: 29,
      dominance: 65,
      leader: 'Ngozi Eze',
      growth: '+5%',
      listings: 145,
      avgRating: 4.5,
      topAgents: ['Ngozi Eze', 'Zainab Usman', 'Olu Adebayo']
    }
  ];

  const filteredTerritories = territories.filter(territory =>
    territory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    territory.leader.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditTerritory = (territoryName: string) => {
    alert(`Editing territory: ${territoryName}`);
  };

  const totalAgents = territories.reduce((sum, t) => sum + t.agents, 0);
  const totalListings = territories.reduce((sum, t) => sum + t.listings, 0);
  const avgDominance = Math.round(territories.reduce((sum, t) => sum + t.dominance, 0) / territories.length);

  const stats = [
    { label: 'Total Territories', value: territories.length, icon: Map },
    { label: 'Active Agents', value: totalAgents, icon: Users },
    { label: 'Avg Dominance', value: `${avgDominance}%`, icon: TrendingUp },
    { label: 'Total Listings', value: totalListings, icon: Building2 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-bg-secondary border border-border-color rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search territories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-color rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerritories.map((territory, index) => (
          <motion.div
            key={territory.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text-primary text-lg">{territory.name}</h3>
                  <button
                    onClick={() => handleEditTerritory(territory.name)}
                    className="p-1 hover:bg-bg-tertiary rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-text-tertiary" />
                  </button>
                </div>
                <p className="text-sm text-text-secondary">
                  {territory.agents} active agents • {territory.listings} listings
                </p>
              </div>
              <span className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded-full">
                {territory.growth}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-text-secondary">Market Dominance</span>
                  <span className="font-bold text-primary">{territory.dominance}%</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${territory.dominance}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-gold rounded-full"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border-color space-y-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <span className="text-sm text-text-secondary">Leader: </span>
                    <span className="text-sm font-medium text-text-primary">{territory.leader}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-xs text-text-secondary">{territory.avgRating}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-text-tertiary mb-2">Top Agents:</p>
                  <div className="flex flex-wrap gap-2">
                    {territory.topAgents.slice(0, 3).map((agent, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                      >
                        <Award className="w-3 h-3" />
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTerritories.length === 0 && (
        <div className="text-center py-12">
          <Map className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary">No territories found</p>
        </div>
      )}
    </div>
  );
}