from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class ProactiveActionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    alert_id: str
    action_type: str
    content: str
    status: str
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None

class AffectedCustomerItem(BaseModel):
    customer_id: str
    name: str
    priority: str
    plan_name: str
    ticket_id: Optional[str] = None
    emotion: str
    risk: str
    recommended_action: str

class ProactiveAlertDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    alert_id: str
    alert_type: str
    title: str
    description: str
    location: str
    affected_customers: int
    severity: str
    status: str
    estimated_resolution: str
    created_at: Optional[datetime] = None
    actions: List[ProactiveActionSchema] = []
    affected_list_preview: List[AffectedCustomerItem] = []

class PrepareActionRequest(BaseModel):
    action_type: str
    custom_content: Optional[str] = None

class ApproveActionRequest(BaseModel):
    action_id: int
    agent_id: str = 'agent_demo'

class UsageAlertOpportunity(BaseModel):
    customer_id: str
    customer_name: str
    plan_name: str
    usage_gb: float
    allowance_gb: float
    percent_used: float
    recommended_plan: str
    opportunity_score: float  # e.g. 73%
    trigger: str
    suggested_action: str
    best_outreach: str
