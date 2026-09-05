from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class KnowledgeArticleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    article_id: str
    title: str
    category: str
    subcategory: Optional[str] = None
    content: str
    keywords: List[str] = []
    tags: List[str] = []
    usage_count: int = 0
    success_rate: float = 0.90
    avg_resolution_time: float = 2.5
    effectiveness_score: float = 0.90
    last_updated: Optional[datetime] = None
    review_date: Optional[datetime] = None

class KnowledgeSearchResult(BaseModel):
    article_id: str
    title: str
    category: str
    relevance_score: float
    matched_keywords: List[str]
    content: str
    effectiveness_score: float

class KnowledgeSearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    limit: int = 5

class KnowledgeGap(BaseModel):
    id: str
    topic: str
    affected_ticket_count: int
    gap_severity: str  # High, Medium, Low
    recommended_article: str
    category: str

class CreateDraftArticleRequest(BaseModel):
    gap_id: Optional[str] = None
    title: str
    category: str
    content: str
    keywords: List[str] = []

class KnowledgeAnalytics(BaseModel):
    total_articles: int
    used_today: int
    average_effectiveness: float
    knowledge_gaps_count: int
    top_articles: List[KnowledgeArticleSchema] = []
