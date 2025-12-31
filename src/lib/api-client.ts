// API Client for frontend
// Connects to the Express backend server

// Default to localhost:3000 for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

  getToken(): string | null {
    return this.token;
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
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
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

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data.data !== undefined ? data.data : (data as unknown as T);
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // File upload method using FormData
  async uploadFiles(files: File[], type: 'image' | 'video' | 'document' = 'image'): Promise<{ urls: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    // Don't set Content-Type - let browser set it with boundary for FormData

    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Upload failed: ${response.status}`);
      }

      return data.data || { urls: [] };
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Upload property media (images and videos)
  async uploadPropertyMedia(files: File[]): Promise<{ images: string[]; videos: string[] }> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}/upload/property-media`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Upload failed: ${response.status}`);
      }

      // Backend returns { images: string[], videos: string[] } format
      return {
        images: data.data?.images || [],
        videos: data.data?.videos || [],
      };
    } catch (error) {
      console.error('Property media upload failed:', error);
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
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors during logout
    }
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
    return this.request<any[]>('/properties', {
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

  async getMyListings() {
    return this.request<any[]>('/properties/my/listings');
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

  async unlockInterest(id: string) {
    return this.request(`/interests/${id}/unlock`, {
      method: 'POST',
    });
  }

  // Agent - Get all seekers who expressed interest
  async getAgentSeekers(params?: {
    propertyId?: string;
    status?: 'pending' | 'contacted' | 'viewing-scheduled' | 'closed';
  }) {
    return this.request<{
      data: any[];
      summary: {
        total: number;
        pending: number;
        contacted: number;
        viewingScheduled: number;
        closed: number;
      };
    }>('/interests/agent/seekers', {
      method: 'GET',
      params: params as any,
    });
  }

  // Get seekers for specific property
  async getPropertySeekers(propertyId: string) {
    return this.request<{
      data: any[];
      property: any;
    }>(`/interests/property/${propertyId}`, {
      method: 'GET',
    });
  }

  // Get my expressed interests (for seekers)
  async getMyInterests() {
    return this.request<any[]>('/interests/my');
  }

  // Get chat for specific interest
  async getInterestChat(interestId: string) {
    return this.request(`/interests/${interestId}/chat`);
  }

  // Inspection endpoints
  async scheduleInspection(inspectionData: {
    interestId: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
  }) {
    return this.request('/inspections', {
      method: 'POST',
      body: JSON.stringify(inspectionData),
    });
  }

  async getMyInspections() {
    return this.request<any[]>('/inspections/my');
  }

  async getAgentInspections(params?: {
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    upcoming?: boolean;
  }) {
    return this.request<any[]>('/inspections/agent', {
      method: 'GET',
      params: params as any,
    });
  }

  async getPropertyInspections(propertyId: string) {
    return this.request<any[]>(`/inspections/property/${propertyId}`);
  }

  async updateInspection(id: string, data: {
    scheduledDate?: string;
    scheduledTime?: string;
    notes?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
    agentNotes?: string;
  }) {
    return this.request(`/inspections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelInspection(id: string) {
    return this.request(`/inspections/${id}`, {
      method: 'DELETE',
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

  async createChatSession(participantId: string, propertyId?: string, initialMessage?: string) {
    return this.request('/chats', {
      method: 'POST',
      body: JSON.stringify({ participantId, propertyId, initialMessage }),
    });
  }

  // Credits endpoints
  async getCreditBundles() {
    return this.request('/credits/bundles');
  }

  async getCreditBalance() {
    return this.request('/credits/balance');
  }

  async purchaseCredits(bundleId: string, paymentReference?: string) {
    return this.request('/credits/purchase', {
      method: 'POST',
      body: JSON.stringify({ bundleId, paymentReference }),
    });
  }

  async getTransactions() {
    return this.request('/credits/transactions');
  }

  async loadWallet(amount: number) {
    return this.request('/credits/wallet/load', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Territories endpoints
  async claimTerritory(area: string, cost: number, state?: string, dailyIncome?: number) {
    return this.request('/territories/claim', {
      method: 'POST',
      body: JSON.stringify({ area, cost, state, dailyIncome }),
    });
  }

  async getMyTerritories() {
    return this.request('/territories/my');
  }

  async getTerritories(params?: { area?: string; agentId?: string }) {
    return this.request('/territories', {
      params: params as any,
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

  // Gamification
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

  async getGamificationTerritories(params?: { agentId?: string; area?: string }) {
    return this.request('/gamification/territories', {
      params: params as any,
    });
  }

  // Marketplace
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

  // Groups
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

  async addGroupMember(groupId: string, userId: string) {
    return this.request(`/groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Admin
  async getPendingKYC() {
    return this.request('/admin/kyc/review');
  }

  async reviewKYC(agentId: string, status: 'verified' | 'rejected', notes?: string) {
    return this.request('/admin/kyc/review', {
      method: 'POST',
      body: JSON.stringify({ agentId, status, notes }),
    });
  }

  async submitKYC(documents: any) {
    return this.request('/admin/kyc/submit', {
      method: 'POST',
      body: JSON.stringify({ documents }),
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

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  // Analytics
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

  // Notifications
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

  // Locations
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

  // CIU System
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
