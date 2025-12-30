// API Client for frontend
// This will make calls to the Vercel API routes

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('vilanow_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('vilanow_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('vilanow_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;
    
    // Add query params
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Add auth header
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data.data || data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: 'seeker' | 'agent' | 'admin';
    agentType?: 'direct' | 'semi-direct';
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string; session: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async requestPasswordReset(email: string) {
    return this.request('/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/auth/password-reset', {
      method: 'PATCH',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Property endpoints
  async getProperties(params?: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    agentId?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    return this.request('/properties', {
      method: 'GET',
      params: params as any,
    });
  }

  async getProperty(id: string) {
    return this.request(`/properties/${id}`);
  }

  async createProperty(propertyData: any) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id: string, propertyData: any) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: string) {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Interest endpoints
  async getInterests(params?: {
    propertyId?: string;
    seekerId?: string;
  }) {
    return this.request('/interests', {
      method: 'GET',
      params: params as any,
    });
  }

  async createInterest(interestData: {
    propertyId: string;
    message: string;
    seriousnessScore?: number;
  }) {
    return this.request('/interests', {
      method: 'POST',
      body: JSON.stringify(interestData),
    });
  }

  async updateInterest(id: string, interestData: any) {
    return this.request(`/interests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(interestData),
    });
  }

  // Chat endpoints
  async getChatSessions() {
    return this.request('/chats');
  }

  async getChatMessages(sessionId: string) {
    return this.request(`/chats/${sessionId}/messages`);
  }

  async sendMessage(sessionId: string, message: string, type: string = 'text') {
    return this.request(`/chats/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, type }),
    });
  }

  // Credits endpoints
  async getCreditBundles() {
    return this.request('/credits/bundles');
  }

  async getCreditBalance() {
    return this.request('/credits/balance');
  }

  async purchaseCredits(bundleId: string) {
    return this.request('/credits/purchase', {
      method: 'POST',
      body: JSON.stringify({ bundleId }),
    });
  }

  async getTransactions() {
    return this.request('/credits/transactions');
  }

  // Territories endpoints
  async claimTerritory(area: string, cost: number, state?: string, dailyIncome?: number) {
    return this.request('/territories/claim', {
      method: 'POST',
      body: JSON.stringify({ area, cost, state, dailyIncome }),
    });
  }

  // Marketplace endpoints
  async purchaseOffer(offerId: string) {
    return this.request(`/marketplace/offers/${offerId}/purchase`, {
      method: 'POST',
    });
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string, hardDelete: boolean = false) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ hardDelete }),
    });
  }

  // Phase 6: Gamification
  async getChallenges(params?: { agentId?: string; completed?: boolean }) {
    return this.request('/gamification/challenges', {
      params: params as any,
    });
  }

  async createChallenge(challengeData: any) {
    return this.request('/gamification/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    });
  }

  async updateChallenge(id: string, challengeData: any) {
    return this.request(`/gamification/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challengeData),
    });
  }

  async getQuests(params?: { userId?: string; type?: string; completed?: boolean }) {
    return this.request('/gamification/quests', {
      params: params as any,
    });
  }

  async getLeaderboard(sortBy: 'xp' | 'credits' | 'listings' | 'deals' = 'xp', limit: number = 10) {
    return this.request('/gamification/leaderboard', {
      params: { sortBy, limit },
    });
  }

  async getBadges(agentId?: string) {
    return this.request('/gamification/badges', {
      params: agentId ? { agentId } : undefined,
    });
  }

  async getTerritories(params?: { agentId?: string; area?: string }) {
    return this.request('/gamification/territories', {
      params: params as any,
    });
  }

  // Phase 7: Marketplace
  async getMarketplaceOffers(params?: { agentId?: string; type?: string; status?: string }) {
    return this.request('/marketplace/offers', {
      params: params as any,
    });
  }

  async createMarketplaceOffer(offerData: any) {
    return this.request('/marketplace/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  async getCollaborations(params?: { agentId?: string; type?: string; status?: string }) {
    return this.request('/marketplace/collaborations', {
      params: params as any,
    });
  }

  async createCollaboration(collaborationData: any) {
    return this.request('/marketplace/collaborations', {
      method: 'POST',
      body: JSON.stringify(collaborationData),
    });
  }

  // Phase 8: Groups
  async getGroups() {
    return this.request('/groups');
  }

  async createGroup(groupData: { name: string; description: string; avatar?: string }) {
    return this.request('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async getGroupMessages(groupId: string) {
    return this.request(`/groups/${groupId}/messages`);
  }

  async sendGroupMessage(groupId: string, message: string, type: string = 'text') {
    return this.request(`/groups/${groupId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, type }),
    });
  }

  // Phase 9: Admin
  async getPendingKYC() {
    return this.request('/admin/kyc/review');
  }

  async reviewKYC(agentId: string, status: 'verified' | 'rejected', notes?: string) {
    return this.request('/admin/kyc/review', {
      method: 'POST',
      body: JSON.stringify({ agentId, status, notes }),
    });
  }

  async getFlags(params?: { entityType?: string; status?: string; severity?: string }) {
    return this.request('/admin/flags', {
      params: params as any,
    });
  }

  async flagContent(flagData: any) {
    return this.request('/admin/flags', {
      method: 'POST',
      body: JSON.stringify(flagData),
    });
  }

  async getAdminActions(params?: { adminId?: string; action?: string; entityType?: string }) {
    return this.request('/admin/actions', {
      params: params as any,
    });
  }

  async getSettings(key?: string) {
    return this.request('/admin/settings', {
      params: key ? { key } : undefined,
    });
  }

  async updateSetting(key: string, value: any, description?: string) {
    return this.request('/admin/settings', {
      method: 'POST',
      body: JSON.stringify({ key, value, description }),
    });
  }

  // Phase 10: Analytics
  async getReports() {
    return this.request('/analytics/reports');
  }

  async generateReport(type: 'users' | 'properties' | 'interests' | 'financial', parameters?: any) {
    return this.request('/analytics/reports', {
      method: 'POST',
      body: JSON.stringify({ type, parameters }),
    });
  }

  async getMetrics(type: 'overview' | 'users' | 'properties' | 'conversions' = 'overview') {
    return this.request(`/analytics/metrics?type=${type}`);
  }

  async trackEvent(eventData: {
    userId: string;
    event: string;
    entityType?: string;
    entityId?: string;
    metadata?: any;
  }) {
    return this.request('/analytics/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Phase 11: Notifications
  async getNotifications(params?: { read?: boolean; type?: string }) {
    return this.request('/notifications', {
      params: params as any,
    });
  }

  async createNotification(notificationData: {
    targetUserId?: string;
    broadcast?: boolean;
    title: string;
    message: string;
    type: string;
    metadata?: any;
  }) {
    return this.request('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async markNotificationsRead(notificationId?: string, markAll?: boolean) {
    if (markAll) {
      return this.request('/notifications', {
        method: 'PUT',
        body: JSON.stringify({ markAllAsRead: true }),
      });
    }
    return this.request('/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notificationId, read: true }),
    });
  }

  async deleteNotification(notificationId?: string, deleteAll?: boolean) {
    const url = deleteAll ? '/notifications?deleteAll=true' : `/notifications?id=${notificationId}`;
    return this.request(url, {
      method: 'DELETE',
    });
  }

  async getNotificationPreferences() {
    return this.request('/notifications/preferences');
  }

  async updateNotificationPreferences(preferences: any) {
    return this.request('/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Phase 12: Territories & Locations
  async getLocations(params?: { area?: string; state?: string; search?: string }) {
    return this.request('/territories/locations', {
      params: params as any,
    });
  }

  async createLocation(locationData: {
    name: string;
    area: string;
    state?: string;
    coordinates?: any;
    boundaries?: any;
  }) {
    return this.request('/territories/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  async getLocation(id: string) {
    return this.request(`/territories/locations/${id}`);
  }

  async updateLocation(id: string, locationData: any) {
    return this.request(`/territories/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
  }

  async deleteLocation(id: string) {
    return this.request(`/territories/locations/${id}`, {
      method: 'DELETE',
    });
  }

  // Phase 13-14: CIU System
  // Closable Deals
  async getClosableDeals(params?: { status?: string; urgency?: string; assignedTo?: string }) {
    return this.request('/ciu/deals', {
      params: params as any,
    });
  }

  async createClosableDeal(dealData: {
    propertyId: string;
    agentId: string;
    urgency?: string;
    closingProbability?: number;
    assignedTo?: string;
  }) {
    return this.request('/ciu/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  }

  async updateClosableDeal(id: string, dealData: any) {
    return this.request(`/ciu/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    });
  }

  // Vilanow Tasks
  async getVilanowTasks(params?: { status?: string; priority?: string; assignedAgent?: string }) {
    return this.request('/ciu/tasks', {
      params: params as any,
    });
  }

  async createVilanowTask(taskData: {
    dealId: string;
    propertyTitle: string;
    assignedAgent: string;
    priority?: string;
    deadline?: string;
  }) {
    return this.request('/ciu/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateVilanowTask(id: string, taskData: any) {
    return this.request(`/ciu/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  // Risk Flags
  async getRiskFlags(params?: { type?: string; severity?: string; status?: string }) {
    return this.request('/ciu/risks', {
      params: params as any,
    });
  }

  async createRiskFlag(riskData: {
    entityType: string;
    entityId: string;
    type: string;
    severity: string;
    evidence?: any[];
    description?: string;
  }) {
    return this.request('/ciu/risks', {
      method: 'POST',
      body: JSON.stringify(riskData),
    });
  }

  async updateRiskFlag(id: string, riskData: any) {
    return this.request(`/ciu/risks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(riskData),
    });
  }

  // Automation Rules
  async getAutomationRules(params?: { enabled?: boolean }) {
    return this.request('/ciu/automation', {
      params: params as any,
    });
  }

  async createAutomationRule(ruleData: {
    name: string;
    description?: string;
    condition: any;
    action: any;
    enabled?: boolean;
    priority?: number;
  }) {
    return this.request('/ciu/automation', {
      method: 'POST',
      body: JSON.stringify(ruleData),
    });
  }

  async updateAutomationRule(id: string, ruleData: any) {
    return this.request(`/ciu/automation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ruleData),
    });
  }

  async deleteAutomationRule(id: string) {
    return this.request(`/ciu/automation/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export { ApiClient };
export default apiClient;

