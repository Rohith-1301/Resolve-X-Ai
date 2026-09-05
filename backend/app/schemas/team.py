from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class SpecialistSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    title: str
    department: str
    expertise: str
    active_tickets: int
    max_capacity: int
    status: str
    avatar: Optional[str] = None

class ConsultRequest(BaseModel):
    specialist_id: Optional[int] = None
    question: str
    ticket_id: Optional[str] = None
    customer_id: Optional[str] = None

class ConsultResponse(BaseModel):
    specialist_name: str
    question: str
    response: str
    tag: str = 'Demo consultation'
    timestamp: str
