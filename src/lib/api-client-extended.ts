// Extended API Client with all Enhancement Phase endpoints
// Extends the base apiClient with methods for Phases 6-10
import apiClient, { ApiClient } from './api-client';

// Phase 6: Gamification
export const gamificationAPI = {
  // Challenges
  async getChallenges(params?: { agentId?: string; completed?: boolean }) {
    return apiClient.request('/gamification/challenges', {
      params: params as any,
    });
  },

  async createChallenge(challengeData: any) {
    return apiClient.request('/gamification/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    });
  },

  async getChallenge(id: string) {
    return apiClient.request(`/gamification/challenges/${id}`);
  },

  async updateChallenge(id: string, challengeData: any) {
    return apiClient.request(`/gamification/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challengeData),
    });
  },

  // Quests
  async getQuests(params?: { userId?: string; type?: string; completed?: boolean }) {
    return apiClient.request('/gamification/quests', {
      params: params as any,
    });
  },

  async createQuest(questData: any) {
    return apiClient.request('/gamification/quests', {
      method: 'POST',
      body: JSON.stringify(questData),
    });
  },

  async updateQuest(id: string, questData: any) {
    return apiClient.request(`/gamification/quests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questData),
    });
  },

  // Badges
  async getBadges(agentId?: string) {
    return apiClient.request('/gamification/badges', {
      params: agentId ? { agentId } : undefined,
    });
  },

  async awardBadge(agentId: string, badge: string) {
    return apiClient.request('/gamification/badges', {
      method: 'POST',
      body: JSON.stringify({ agentId, badge }),
    });
  },

  // Territories
  async getTerritories(params?: { agentId?: string; area?: string }) {
    return apiClient.request('/gamification/territories', {
      params: params as any,
    });
  },

  async assignTerritory(territoryData: any) {
    return apiClient.request('/gamification/territories', {
      method: 'POST',
      body: JSON.stringify(territoryData),
    });
  },

  // Leaderboard
  async getLeaderboard(sortBy: 'xp' | 'credits' | 'listings' | 'deals' = 'xp', limit: number = 10) {
    return apiClient.request('/gamification/leaderboard', {
      params: { sortBy, limit },
    });
  },
};

// Phase 7: Marketplace
export const marketplaceAPI = {
  // Offers
  async getOffers(params?: { agentId?: string; type?: string; status?: string }) {
    return apiClient.request('/marketplace/offers', { params });
  },

  async createOffer(offerData: any) {
    return apiClient.request('/marketplace/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  },

  async getOffer(id: string) {
    return apiClient.request(`/marketplace/offers/${id}`);
  },

  async updateOffer(id: string, offerData: any) {
    return apiClient.request(`/marketplace/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    });
  },

  async deleteOffer(id: string) {
    return apiClient.request(`/marketplace/offers/${id}`, {
      method: 'DELETE',
    });
  },

  // Collaborations
  async getCollaborations(params?: { agentId?: string; type?: string; status?: string }) {
    return apiClient.request('/marketplace/collaborations', { params });
  },

  async createCollaboration(collaborationData: any) {
    return apiClient.request('/marketplace/collaborations', {
      method: 'POST',
      body: JSON.stringify(collaborationData),
    });
  },

  async updateCollaboration(id: string, collaborationData: any) {
    return apiClient.request(`/marketplace/collaborations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(collaborationData),
    });
  },
};

// Phase 8: Groups
export const groupsAPI = {
  async getGroups() {
    return apiClient.request('/groups');
  },

  async createGroup(groupData: { name: string; description: string; avatar?: string }) {
    return apiClient.request('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  },

  async getGroup(id: string) {
    return apiClient.request(`/groups/${id}`);
  },

  async updateGroup(id: string, groupData: any) {
    return apiClient.request(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
  },

  async deleteGroup(id: string) {
    return apiClient.request(`/groups/${id}`, {
      method: 'DELETE',
    });
  },

  async getGroupMessages(groupId: string) {
    return apiClient.request(`/groups/${groupId}/messages`);
  },

  async sendGroupMessage(groupId: string, message: string, type: string = 'text') {
    return apiClient.request(`/groups/${groupId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, type }),
    });
  },
};

// Phase 9: Admin Tools
export const adminAPI = {
  // KYC Review
  async getPendingKYC() {
    return apiClient.request('/admin/kyc/review');
  },

  async reviewKYC(agentId: string, status: 'verified' | 'rejected', notes?: string) {
    return apiClient.request('/admin/kyc/review', {
      method: 'POST',
      body: JSON.stringify({ agentId, status, notes }),
    });
  },

  // Flags
  async getFlags(params?: { entityType?: string; status?: string; severity?: string }) {
    return apiClient.request('/admin/flags', { params });
  },

  async flagContent(flagData: {
    entityType: string;
    entityId: string;
    reason: string;
    severity?: 'high' | 'medium' | 'low';
    evidence?: string[];
  }) {
    return apiClient.request('/admin/flags', {
      method: 'POST',
      body: JSON.stringify(flagData),
    });
  },

  async resolveFlag(flagId: string, status: 'resolved' | 'dismissed', notes?: string) {
    return apiClient.request(`/admin/flags/${flagId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Admin Actions
  async getAdminActions(params?: { adminId?: string; action?: string; entityType?: string }) {
    return apiClient.request('/admin/actions', { params });
  },

  async logAction(actionData: {
    action: string;
    entityType?: string;
    entityId?: string;
    details?: any;
  }) {
    return apiClient.request('/admin/actions', {
      method: 'POST',
      body: JSON.stringify(actionData),
    });
  },

  // Settings
  async getSettings(key?: string) {
    return apiClient.request('/admin/settings', {
      params: key ? { key } : undefined,
    });
  },

  async updateSetting(key: string, value: any, description?: string) {
    return apiClient.request('/admin/settings', {
      method: 'POST',
      body: JSON.stringify({ key, value, description }),
    });
  },
};

// Phase 10: Analytics
export const analyticsAPI = {
  async getReports() {
    return apiClient.request('/analytics/reports');
  },

  async generateReport(type: 'users' | 'properties' | 'interests' | 'financial', parameters?: any) {
    return apiClient.request('/analytics/reports', {
      method: 'POST',
      body: JSON.stringify({ type, parameters }),
    });
  },

  async getMetrics(type: 'overview' | 'users' | 'properties' | 'conversions' = 'overview') {
    return apiClient.request(`/analytics/metrics?type=${type}`);
  },

  async trackEvent(eventData: {
    userId: string;
    event: string;
    entityType?: string;
    entityId?: string;
    metadata?: any;
  }) {
    return apiClient.request('/analytics/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async getEvents(params?: {
    event?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    return apiClient.request('/analytics/events', { params });
  },
};

// Export all APIs
export default {
  ...apiClient,
  gamification: gamificationAPI,
  marketplace: marketplaceAPI,
  groups: groupsAPI,
  admin: adminAPI,
  analytics: analyticsAPI,
};

