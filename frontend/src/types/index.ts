export interface Customer {
  id: number;
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  customer_type: string;
  priority: string;
  tags: string[];
  plan_name?: string;
  monthly_price?: number;
  billing_status?: string;
  risk_score?: number;
  health_status?: string;
}

export interface Account {
  id: number;
  customer_id: string;
  account_number: string;
  service_type: string;
  plan_name: string;
  monthly_price: number;
  additional_charges: number;
  billing_status: string;
  service_status: string;
  account_status: string;
  contract_start?: string;
  contract_end?: string;
}

export interface CustomerUsage {
  id: number;
  customer_id: string;
  period: string;
  data_usage_gb: number;
  mobile_usage_gb: number;
  connected_devices: number;
  peak_usage_start: string;
  peak_usage_end: string;
  usage_pattern: string;
  hotspot_usage: string;
}

export interface CustomerHealth {
  customer_id: string;
  risk_score: number;
  health_status: string;
  risk_factors: string[];
  recommended_action: string;
  updated_at?: string;
}

export interface CustomerJourneyEvent {
  id: number;
  customer_id: string;
  event_type: string;
  title: string;
  description: string;
  event_date: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface TeamNote {
  id: number;
  customer_id: string;
  author: string;
  note: string;
  created_at?: string;
}

export interface Customer360Data {
  profile: Customer;
  accounts: Account[];
  current_tickets: any[];
  previous_tickets: any[];
  conversations: any[];
  usage?: CustomerUsage;
  health?: CustomerHealth;
  journey: CustomerJourneyEvent[];
  sentiment_history: any[];
  recommended_action: string;
  knowledge_interactions: any[];
  team_notes: TeamNote[];
}

export interface Message {
  id: number;
  conversation_id: string;
  sender_type: 'customer' | 'agent' | 'ai' | 'system';
  message_text: string;
  timestamp: string;
  emotion: string;
  sentiment_score: number;
  emotion_confidence: number;
  urgency: string;
}

export interface NextBestAction {
  action: string;
  title: string;
  confidence: number;
  reason: string;
}

export interface QualityFactor {
  category: string;
  score: number;
  weight: number;
  explanation: string;
}

export interface QualityScore {
  overall_score: number;
  grounding: number;
  citation: number;
  data_consistency: number;
  tone: number;
  completeness: number;
  safety: number;
  factors: QualityFactor[];
}

export interface HandoffSummary {
  customer_name: string;
  customer_id: string;
  issue: string;
  emotion_label: string;
  previous_ticket: string;
  previous_outcome: string;
  tried_steps: string[];
  relevant_knowledge: string;
  ai_confidence_percent: string;
  recommended_specialist: string;
  escalation_reason: string;
  recommended_next_action: string;
}

export interface AIAnalysisResult {
  ticket_id: string;
  intent: string;
  subcategory?: string;
  emotion: string;
  emotion_confidence: number;
  urgency: string;
  confidence: number;
  priority: string;
  decision: 'RESOLUTION_READY' | 'NEEDS_INFORMATION' | 'ESCALATION_REQUIRED';
  success_probability: number;
  missing_information: string[];
  suggested_question?: string;
  recommended_articles: string[];
  specialist?: string;
  specialist_match?: number;
  specialist_reason?: string;
  draft_response?: string;
  reason: string;
  evidence: string[];
  next_best_actions: NextBestAction[];
  quality?: QualityScore;
  handoff_summary?: HandoffSummary;
  processing_time: number;
}

export interface AuditLog {
  id: number;
  ticket_id: string;
  action: string;
  actor_type: string;
  actor_id: string;
  action_data: any;
  created_at: string;
}

export interface TicketListItem {
  id: number;
  ticket_id: string;
  customer_id: string;
  customer_name: string;
  customer_priority: string;
  category: string;
  subcategory?: string;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  ai_status: string;
  ai_confidence: number;
  success_probability: number;
  specialist?: string;
  risk_score: number;
  business_impact_score: number;
  created_at: string;
  updated_at: string;
  latest_emotion: string;
}

export interface TicketDetail extends TicketListItem {
  conversation_id: string;
  specialist_match: number;
  resolved_at?: string;
  messages: Message[];
  ai_analysis?: AIAnalysisResult;
  audit_logs: AuditLog[];
}

export interface KnowledgeArticle {
  id: number;
  article_id: string;
  title: string;
  category: string;
  subcategory?: string;
  content: string;
  keywords: string[];
  tags: string[];
  usage_count: number;
  success_rate: number;
  avg_resolution_time: number;
  effectiveness_score: number;
  last_updated?: string;
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  affected_ticket_count: number;
  gap_severity: 'High' | 'Medium' | 'Low';
  recommended_article: string;
  category: string;
}

export interface ProactiveAlert {
  id: number;
  alert_id: string;
  alert_type: string;
  title: string;
  description: string;
  location: string;
  affected_customers: number;
  severity: string;
  status: string;
  estimated_resolution: string;
  created_at: string;
  actions?: any[];
  affected_list_preview?: any[];
}

export interface Specialist {
  id: number;
  name: string;
  title: string;
  department: string;
  expertise: string;
  active_tickets: number;
  max_capacity: number;
  status: string;
  avatar?: string;
}
