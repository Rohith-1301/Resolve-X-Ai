from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class AccountSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    customer_id: str
    account_number: str
    service_type: str
    plan_name: str
    monthly_price: float
    additional_charges: float
    billing_status: str
    service_status: str
    account_status: str
    contract_start: Optional[datetime] = None
    contract_end: Optional[datetime] = None

class CustomerUsageSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    customer_id: str
    period: str
    data_usage_gb: float
    mobile_usage_gb: float
    connected_devices: int
    peak_usage_start: str
    peak_usage_end: str
    usage_pattern: str
    hotspot_usage: str

class CustomerHealthSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    customer_id: str
    risk_score: float
    health_status: str
    risk_factors: List[str]
    recommended_action: str
    updated_at: Optional[datetime] = None

class CustomerJourneyEventSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    customer_id: str
    event_type: str
    title: str
    description: Optional[str] = None
    event_date: str
    severity: str

class TeamNoteSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    customer_id: str
    author: str
    note: str
    created_at: Optional[datetime] = None

class TeamNoteCreate(BaseModel):
    customer_id: str
    author: str
    note: str

class CustomerSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    customer_id: str
    name: str
    email: str
    phone: str
    address: str
    customer_type: str
    priority: str
    tags: List[str]
    created_at: Optional[datetime] = None

class Customer360Response(BaseModel):
    profile: CustomerSchema
    accounts: List[AccountSchema]
    current_tickets: List[Dict[str, Any]]
    previous_tickets: List[Dict[str, Any]]
    conversations: List[Dict[str, Any]]
    usage: Optional[CustomerUsageSchema] = None
    health: Optional[CustomerHealthSchema] = None
    journey: List[CustomerJourneyEventSchema] = []
    sentiment_history: List[Dict[str, Any]] = []
    recommended_action: str
    knowledge_interactions: List[Dict[str, Any]] = []
    team_notes: List[TeamNoteSchema] = []
