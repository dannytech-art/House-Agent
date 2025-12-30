import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Bed, DollarSign, Clock, CheckCircle, Archive } from 'lucide-react';
import { SeekerRequestModal } from '../components/SeekerRequestModal';
import { mockRequests } from '../utils/mockData';
import { PropertyRequest } from '../types';
export function SeekerRequestsPage() {
  const [requests, setRequests] = useState<PropertyRequest[]>(mockRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'active' | 'fulfilled' | 'expired'>('active');
  const handleCreateRequest = (newRequest: any) => {
    const request: PropertyRequest = {
      id: `req-${Date.now()}`,
      seekerId: 'current-user',
      ...newRequest
    };
    setRequests([request, ...requests]);
  };
  const filteredRequests = requests.filter(req => req.status === filter);
  const formatCurrency = (amount: number) => {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  return <div className="min-h-screen bg-bg-secondary pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
              My Requests
            </h1>
            <p className="text-text-secondary">
              Manage your property requirements and track matches
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-gradient-gold hover:opacity-90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 gold-glow">
            <Plus className="w-5 h-5" />
            Post New Request
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['active', 'fulfilled', 'expired'].map(status => <button key={status} onClick={() => setFilter(status as any)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${filter === status ? 'bg-primary text-black' : 'bg-bg-primary text-text-secondary border border-border-color hover:border-primary/50'}`}>
              {status}
            </button>)}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length > 0 ? filteredRequests.map((request, index) => <motion.div key={request.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="bg-bg-primary border border-border-color rounded-2xl p-6 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full capitalize">
                        {request.type}
                      </span>
                      <span className="text-xs text-text-tertiary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Posted {formatDate(request.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-text-primary mb-1">
                      {request.bedrooms} Bedroom {request.type} in{' '}
                      {request.location}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gradient-gold">
                      {formatCurrency(request.minBudget)} -{' '}
                      {formatCurrency(request.maxBudget)}
                    </p>
                    <p className="text-xs text-text-tertiary">Budget Range</p>
                  </div>
                </div>

                <p className="text-text-secondary text-sm mb-6 line-clamp-2">
                  {request.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border-color">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin className="w-4 h-4 text-primary" />
                      {request.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Bed className="w-4 h-4 text-primary" />
                      {request.bedrooms} Beds
                    </div>
                  </div>

                  {request.status === 'active' && <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {request.matches} Potential Matches
                      </span>
                      <button className="px-4 py-2 bg-bg-secondary hover:bg-bg-tertiary text-text-primary text-sm font-medium rounded-lg transition-colors">
                        View Matches
                      </button>
                    </div>}

                  {request.status === 'fulfilled' && <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Request Fulfilled
                      </span>
                    </div>}
                </div>
              </motion.div>) : <div className="text-center py-12 bg-bg-primary rounded-2xl border border-border-color border-dashed">
              <Archive className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">
                No {filter} requests
              </h3>
              <p className="text-text-secondary mb-6">
                {filter === 'active' ? "You haven't posted any property requests yet." : `You don't have any ${filter} requests.`}
              </p>
              {filter === 'active' && <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-bg-secondary hover:bg-bg-tertiary text-text-primary font-medium rounded-xl transition-colors">
                  Post Your First Request
                </button>}
            </div>}
        </div>
      </div>

      <SeekerRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateRequest} />
    </div>;
}