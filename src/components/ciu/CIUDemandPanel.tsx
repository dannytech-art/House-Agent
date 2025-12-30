import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MapPin, Search, MousePointerClick, TrendingUp as TrendUpIcon } from 'lucide-react';
import { mockDemandSupplyData } from '../../utils/mockCIUData';
import { AdminMapView } from '../AdminMapView';
import { mockProperties } from '../../utils/mockData';

export function CIUDemandPanel() {
  const [viewMode, setViewMode] = useState<'heatmap' | 'table'>('heatmap');

  return (
    <div className="space-y-6">
      {/* Demand-Supply Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {mockDemandSupplyData.areas.map((area, index) => (
          <motion.div
            key={area.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-bg-secondary border border-border-color rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-text-primary">{area.name}</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">Demand</span>
                  <span className="font-bold text-text-primary">{area.demand}%</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${area.demand}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">Supply</span>
                  <span className="font-bold text-text-primary">{area.supply}%</span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: `${area.supply}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`${area.imbalance < 0 ? 'text-danger' : 'text-success'}`}>
                  {area.imbalance < 0 ? 'Under-supplied' : 'Over-supplied'}
                </span>
                <div className={`flex items-center gap-1 ${area.trend === 'rising' ? 'text-success' : area.trend === 'falling' ? 'text-danger' : 'text-text-tertiary'}`}>
                  {area.trend === 'rising' ? <TrendingUp className="w-3 h-3" /> : area.trend === 'falling' ? <TrendingDown className="w-3 h-3" /> : null}
                  <span>{area.trend}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Map */}
      <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary">Demand Heatmap</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'heatmap'
                  ? 'bg-primary text-black'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary text-black'
                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              Table
            </button>
          </div>
        </div>
        <AdminMapView properties={mockProperties} height="400px" />
      </div>

      {/* Popular Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <TrendUpIcon className="w-5 h-5 text-primary" />
            Popular Search Areas
          </h3>
          <div className="space-y-3">
            {mockDemandSupplyData.popularAreas.map((area, index) => (
              <div key={area.area} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg">
                <div>
                  <p className="font-medium text-text-primary">{area.area}</p>
                  <div className="flex items-center gap-4 text-xs text-text-tertiary mt-1">
                    <span className="flex items-center gap-1">
                      <Search className="w-3 h-3" />
                      {area.searchCount} searches
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {area.swipeCount} swipes
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${area.trend === 'rising' ? 'text-success' : 'text-text-tertiary'}`}>
                  {area.trend === 'rising' && <TrendingUp className="w-4 h-4" />}
                  <span className="text-sm font-medium capitalize">{area.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Top Search Prompts
          </h3>
          <div className="space-y-3">
            {mockDemandSupplyData.searchPrompts.map((prompt, index) => (
              <div key={index} className="p-3 bg-bg-primary rounded-lg">
                <p className="font-medium text-text-primary mb-1">"{prompt.prompt}"</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-tertiary">
                    {prompt.area && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {prompt.area}
                      </span>
                    )}
                  </span>
                  <span className="text-primary font-medium">{prompt.frequency} searches</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

