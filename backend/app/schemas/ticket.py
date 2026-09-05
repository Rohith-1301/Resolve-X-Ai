from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.ai import AIAnalysisResult

class MessageSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    conversation_id: str
    sender_type: str  # customer, agent, ai, system
    message_text: str
    timestamp: Optional[datetime] = None
    emotion: str = 'Neutral'
    sentiment_score: float = 0.0
    emotion_confidence: float = 0.8
    urgency: str = 'Normal'

class AuditLogSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ticket_id: str
    action: str
    actor_type: str
    actor_id: str
    action_data: Dict[str, Any] = {}
    created_at: Optional[datetime] = None

class TicketListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ticket_id: str
    customer_id: str
    customer_name: Optional[str] = None
    customer_priority: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    subject: str
    description: Optional[str] = None
    status: str
    priority: str
    ai_status: str
    ai_confidence: float
    success_probability: float
    specialist: Optional[str] = None
    risk_score: float
    business_impact_score: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    latest_emotion: Optional[str] = 'Neutral'

class TicketDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    ticket_id: str
    customer_id: str
    conversation_id: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    subject: str
    description: Optional[str] = None
    status: str
    priority: str
    ai_status: str
    ai_confidence: float
    success_probability: float
    specialist: Optional[str] = None
    specialist_match: float = 0.0
    risk_score: float
    business_impact_score: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    messages: List[MessageSchema] = []
    ai_analysis: Optional[AIAnalysisResult] = None
    audit_logs: List[AuditLogSchema] = []

class ApproveResponseRequest(BaseModel):
    response_text: str
    cited_articles: List[str] = []
    agent_id: str = 'agent_demo'
    customized: bool = False

class AskCustomerRequest(BaseModel):
    question_text: str
    agent_id: str = 'agent_demo'

class EscalateRequest(BaseModel):
    specialist_id: Optional[str] = None
    specialist_name: Optional[str] = None
    reason: str
    priority_callback: bool = True
    agent_id: str = 'agent_demo'

class CustomerReplyRequest(BaseModel):
    reply_text: Optional[str] = None
    customer_id: Optional[str] = None

class SpecialistActionRequest(BaseModel):
    action_type: str  # dispatch_tech, reset_port, apply_credit, priority_callback, specialist_reply, resolve
    specialist_name: str = 'Amit Sharma'
    notes: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    agent_id: str = 'specialist_demo'

