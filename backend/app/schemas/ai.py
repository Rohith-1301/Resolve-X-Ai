from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class NextBestAction(BaseModel):
    action: str
    title: str
    confidence: float
    reason: str

class QualityFactor(BaseModel):
    category: str
    score: float
    weight: float
    explanation: str

class QualityScore(BaseModel):
    overall_score: float
    grounding: float  # 30%
    citation: float   # 20%
    data_consistency: float  # 20%
    tone: float       # 10%
    completeness: float  # 10%
    safety: float     # 10%
    factors: List[QualityFactor] = []

class AIAnalysisResult(BaseModel):
    ticket_id: str
    intent: str
    subcategory: Optional[str] = None
    emotion: str
    emotion_confidence: float = 0.85
    urgency: str = 'Normal'
    confidence: float = 0.90
    priority: str = 'Normal'
    decision: str  # RESOLUTION_READY, NEEDS_INFORMATION, ESCALATION_REQUIRED
    success_probability: float = 0.85
    missing_information: List[str] = []
    suggested_question: Optional[str] = None
    recommended_articles: List[str] = []
    specialist: Optional[str] = None
    specialist_match: float = 0.0
    specialist_reason: Optional[str] = None
    draft_response: Optional[str] = None
    reason: str
    evidence: List[str] = []
    next_best_actions: List[NextBestAction] = []
    quality: Optional[QualityScore] = None
    handoff_summary: Optional[Dict[str, Any]] = None
    processing_time: float = 0.45
