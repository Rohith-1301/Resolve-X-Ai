const API_BASE = 'http://127.0.0.1:8000/api';

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody?.error?.message || errorBody?.detail || `HTTP Error ${res.status}`;
    throw new Error(message);
  }

  const json = await res.json();
  if (json.success !== undefined && !json.success) {
    throw new Error(json.error?.message || 'API request failed');
  }
  return json.data !== undefined ? json.data : json;
}

// Tickets API
export const api = {
  getTickets: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters);
    return request<any[]>(`/tickets?${params.toString()}`);
  },

  getTicket: (ticketId: string) => request<any>(`/tickets/${ticketId}`),

  analyzeTicket: (ticketId: string) =>
    request<any>(`/tickets/${ticketId}/analyze`, { method: 'POST' }),

  generateResponse: (ticketId: string) =>
    request<any>(`/tickets/${ticketId}/generate-response`, { method: 'POST' }),

  approveResponse: (ticketId: string, responseText: string, citedArticles: string[] = [], customized = false) =>
    request<any>(`/tickets/${ticketId}/approve-response`, {
      method: 'POST',
      body: JSON.stringify({ response_text: responseText, cited_articles: citedArticles, customized }),
    }),

  askCustomer: (ticketId: string, questionText: string) =>
    request<any>(`/tickets/${ticketId}/ask-customer`, {
      method: 'POST',
      body: JSON.stringify({ question_text: questionText }),
    }),

  customerReply: (ticketId: string, replyText?: string) =>
    request<any>(`/tickets/${ticketId}/customer-reply`, {
      method: 'POST',
      body: JSON.stringify({ reply_text: replyText }),
    }),


  escalateTicket: (ticketId: string, specialistName: string, reason: string, priorityCallback = true) =>
    request<any>(`/tickets/${ticketId}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ specialist_name: specialistName, reason, priority_callback: priorityCallback }),
    }),

  specialistAction: (ticketId: string, actionType: string, specialistName = 'Amit Sharma', notes?: string, details?: any) =>
    request<any>(`/tickets/${ticketId}/specialist-action`, {
      method: 'POST',
      body: JSON.stringify({ action_type: actionType, specialist_name: specialistName, notes, details }),
    }),

  regenerateAnalysis: (ticketId: string) =>
    request<any>(`/tickets/${ticketId}/regenerate`, { method: 'POST' }),

  resetDemoTickets: () =>
    request<any>('/tickets/reset-demo', { method: 'POST' }),


  // Customers API
  getCustomers: () => request<any[]>('/customers'),

  getCustomer360: (customerId: string) => request<any>(`/customers/${customerId}/360`),

  addCustomerNote: (customerId: string, author: string, note: string) =>
    request<any>('/team/notes', {
      method: 'POST',
      body: JSON.stringify({ customer_id: customerId, author, note }),
    }),

  // Knowledge API
  getArticles: (category?: string) => {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return request<any[]>(`/knowledge${query}`);
  },

  getArticle: (articleId: string) => request<any>(`/knowledge/${articleId}`),

  searchKnowledge: (query: string, category?: string) =>
    request<any[]>('/knowledge/search', {
      method: 'POST',
      body: JSON.stringify({ query, category, limit: 5 }),
    }),

  getKnowledgeGaps: () => request<any[]>('/knowledge/gaps'),

  getKnowledgeAnalytics: () => request<any>('/knowledge/analytics'),

  createDraftArticle: (title: string, category: string, content: string, gapId?: string) =>
    request<any>('/knowledge/draft', {
      method: 'POST',
      body: JSON.stringify({ title, category, content, gap_id: gapId }),
    }),

  // Proactive API
  getProactiveAlerts: () => request<any[]>('/proactive/alerts'),

  getProactiveAlert: (alertId: string) => request<any>(`/proactive/alerts/${alertId}`),

  prepareProactiveAction: (alertId: string, actionType: string, customContent?: string) =>
    request<any>(`/proactive/${alertId}/prepare-action`, {
      method: 'POST',
      body: JSON.stringify({ action_type: actionType, custom_content: customContent }),
    }),

  approveProactiveAction: (alertId: string, actionId: number) =>
    request<any>(`/proactive/${alertId}/approve-action`, {
      method: 'POST',
      body: JSON.stringify({ action_id: actionId }),
    }),

  getOpportunities: () => request<any[]>('/proactive/opportunities'),

  // Analytics API
  getDashboardAnalytics: () => request<any>('/analytics/dashboard'),

  getPredictiveInsights: () => request<any>('/analytics/predictive'),

  getQualityCompliance: () => request<any>('/analytics/quality'),

  // Team API
  getSpecialists: () => request<any[]>('/team/specialists'),

  getWorkload: () => request<any[]>('/team/workload'),

  consultSpecialist: (question: string, specialistId?: number) =>
    request<any>('/team/consult', {
      method: 'POST',
      body: JSON.stringify({ question, specialist_id: specialistId }),
    }),
};
