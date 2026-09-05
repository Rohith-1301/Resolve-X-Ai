from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class OperationalKPIs(BaseModel):
    open_tickets: int
    ai_resolvable: int
    awaiting_customer: int
    escalation_required: int
    avg_resolution_time_min: float
    customer_satisfaction_percent: float
    total_tickets_today: int
    auto_assistance_rate: float

class FlowItem(BaseModel):
    status: str
    count: int
    percent: float

class EmotionDistribution(BaseModel):
    emotion: str
    count: int
    percentage: float

class AIPerformanceMetrics(BaseModel):
    classification_confidence: float
    resolution_success_likelihood: float
    avg_ai_analysis_time_sec: float
    escalation_rate_percent: float

class TrendingIssue(BaseModel):
    topic: str
    change_percent: float
    direction: str  # up, down
    affected_count: int

class CapacityPlan(BaseModel):
    peak_periods: List[str]
    current_agents: int
    recommended_agents: int
    reason: str
    disclaimer: str = 'Demo capacity estimate'

class QualityFactorDetail(BaseModel):
    name: str
    weight: float
    score: float
    description: str

class QualityOverview(BaseModel):
    overall_quality: float
    factors: List[QualityFactorDetail]
    grounded_percent: float
    verified_data_percent: float
    citations_present_percent: float
    human_approval_rate: float

class DashboardOverview(BaseModel):
    kpis: OperationalKPIs
    ticket_flow: List[FlowItem]
    ai_performance: AIPerformanceMetrics
    emotion_distribution: List[EmotionDistribution]
    recent_activity: List[Dict[str, Any]]
