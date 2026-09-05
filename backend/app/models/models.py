import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=False)
    address = Column(String(255), nullable=False)
    customer_type = Column(String(50), default='Standard')  # VIP, Premium, Standard
    priority = Column(String(50), default='Normal')  # High, VIP, Normal
    tags = Column(JSON, default=list)  # ['VIP', 'Tech-Savvy', 'High Usage']
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    accounts = relationship('Account', back_populates='customer', cascade='all, delete-orphan')
    tickets = relationship('Ticket', back_populates='customer', cascade='all, delete-orphan')
    conversations = relationship('Conversation', back_populates='customer', cascade='all, delete-orphan')
    usages = relationship('CustomerUsage', back_populates='customer', cascade='all, delete-orphan')
    health = relationship('CustomerHealth', back_populates='customer', uselist=False, cascade='all, delete-orphan')
    journey_events = relationship('CustomerJourneyEvent', back_populates='customer', cascade='all, delete-orphan')
    team_notes = relationship('TeamNote', back_populates='customer', cascade='all, delete-orphan')

class Account(Base):
    __tablename__ = 'accounts'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey('customers.customer_id'), nullable=False)
    account_number = Column(String(50), unique=True, index=True, nullable=False)
    service_type = Column(String(50), default='Broadband')  # Broadband, Mobile, Fiber
    plan_name = Column(String(100), nullable=False)
    monthly_price = Column(Float, nullable=False)
    additional_charges = Column(Float, default=0.0)
    billing_status = Column(String(50), default='Paid')  # Paid, Overdue, Disputed
    service_status = Column(String(50), default='Active')  # Active, Suspended, Maintenance
    account_status = Column(String(50), default='Good Standing')  # Good Standing, Delinquent
    contract_start = Column(DateTime, default=datetime.datetime.utcnow)
    contract_end = Column(DateTime, nullable=True)

    customer = relationship('Customer', back_populates='accounts')

class Conversation(Base):
    __tablename__ = 'conversations'
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(String(50), ForeignKey('customers.customer_id'), nullable=False)
    channel = Column(String(50), default='Chat')  # Chat, Email, Phone, SMS, Mobile App, Social
    status = Column(String(50), default='Active')
    priority = Column(String(50), default='Normal')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    customer = relationship('Customer', back_populates='conversations')
    messages = relationship('Message', back_populates='conversation', cascade='all, delete-orphan')
    ticket = relationship('Ticket', back_populates='conversation', uselist=False)

class Message(Base):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(String(50), ForeignKey('conversations.conversation_id'), nullable=False)
    sender_type = Column(String(50), nullable=False)  # customer, agent, ai, system
    message_text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    emotion = Column(String(50), default='Neutral')  # Happy, Neutral, Concerned, Frustrated, Angry, Urgent
    sentiment_score = Column(Float, default=0.0)  # -1.0 to 1.0
    emotion_confidence = Column(Float, default=0.8)
    urgency = Column(String(50), default='Normal')  # Low, Normal, High, Critical

    conversation = relationship('Conversation', back_populates='messages')

class Ticket(Base):
    __tablename__ = 'tickets'
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(String(50), ForeignKey('customers.customer_id'), nullable=False)
    conversation_id = Column(String(50), ForeignKey('conversations.conversation_id'), nullable=True)
    category = Column(String(50), nullable=False)  # Billing, Connectivity, Mobile, SIM, Plan, Roaming, Account, Network
    subcategory = Column(String(100), nullable=True)
    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default='Open')  # Open, In Progress, Resolution Ready, Awaiting Customer, Escalated, Resolved
    priority = Column(String(50), default='Normal')  # Low, Normal, High, Critical
    ai_status = Column(String(50), default='ANALYZING')  # RESOLUTION_READY, NEEDS_INFORMATION, ESCALATION_REQUIRED, ANALYZING, IDLE
    ai_confidence = Column(Float, default=0.0)
    success_probability = Column(Float, default=0.0)
    specialist = Column(String(100), nullable=True)
    specialist_match = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)  # 0.0 - 10.0
    business_impact_score = Column(Float, default=0.0)  # 0 - 100
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    customer = relationship('Customer', back_populates='tickets')
    conversation = relationship('Conversation', back_populates='ticket')
    ai_analysis = relationship('AIAnalysis', back_populates='ticket', uselist=False, cascade='all, delete-orphan')
    audit_logs = relationship('AuditLog', back_populates='ticket', cascade='all, delete-orphan')

class KnowledgeArticle(Base):
    __tablename__ = 'knowledge_articles'
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100), nullable=True)
    content = Column(Text, nullable=False)
    keywords = Column(JSON, default=list)
    tags = Column(JSON, default=list)
    usage_count = Column(Integer, default=0)
    success_rate = Column(Float, default=0.9)
    avg_resolution_time = Column(Float, default=3.0)  # in minutes
    effectiveness_score = Column(Float, default=0.9)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    review_date = Column(DateTime, default=datetime.datetime.utcnow)

class CustomerUsage(Base):
    __tablename__ = 'customer_usage'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey('customers.customer_id'), nullable=False)
    period = Column(String(50), default='Current Month')
    data_usage_gb = Column(Float, default=0.0)
    mobile_usage_gb = Column(Float, default=0.0)
    connected_devices = Column(Integer, default=1)
    peak_usage_start = Column(String(20), default='7 PM')
    peak_usage_end = Column(String(20), default='10 PM')
    usage_pattern = Column(String(100), default='General Browsing')
    hotspot_usage = Column(String(50), default='Low')

    customer = relationship('Customer', back_populates='usages')

class CustomerHealth(Base):
    __tablename__ = 'customer_health'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey('customers.customer_id'), unique=True, nullable=False)
    risk_score = Column(Float, default=2.0)  # 0 to 10
    health_status = Column(String(50), default='Good')  # Good, Stable, Attention, High Attention, Critical
    risk_factors = Column(JSON, default=list)
    recommended_action = Column(String(255), default='Routine check-in')
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    customer = relationship('Customer', back_populates='health')

class CustomerJourneyEvent(Base):
    __tablename__ = 'customer_journey_events'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey('customers.customer_id'), nullable=False)
    event_type = Column(String(50), nullable=False)  # plan_inquiry, activation, billing, ticket, outage, follow_up
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(String(50), nullable=False)  # e.g., '30 days ago', 'Today'
    severity = Column(String(50), default='info')  # info, warning, danger, success

    customer = relationship('Customer', back_populates='journey_events')

class ProactiveAlert(Base):
    __tablename__ = 'proactive_alerts'
    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(50), unique=True, index=True, nullable=False)
    alert_type = Column(String(50), nullable=False)  # Network, Maintenance, Billing, Outage
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    affected_customers = Column(Integer, default=0)
    severity = Column(String(50), default='High')  # Low, Medium, High, Critical
    status = Column(String(50), default='Active')  # Active, Monitoring, Resolved
    estimated_resolution = Column(String(50), default='2 hours')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    actions = relationship('ProactiveAction', back_populates='alert', cascade='all, delete-orphan')

class ProactiveAction(Base):
    __tablename__ = 'proactive_actions'
    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(50), ForeignKey('proactive_alerts.alert_id'), nullable=False)
    action_type = Column(String(50), nullable=False)  # Notification, Briefing, Compensation, Knowledge Update
    content = Column(Text, nullable=False)
    status = Column(String(50), default='Prepared')  # Prepared, Approved, Sent
    approved_by = Column(String(100), nullable=True)
    approved_at = Column(DateTime, nullable=True)

    alert = relationship('ProactiveAlert', back_populates='actions')

class Specialist(Base):
    __tablename__ = 'specialists'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    title = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    expertise = Column(String(200), nullable=False)
    active_tickets = Column(Integer, default=3)
    max_capacity = Column(Integer, default=10)
    status = Column(String(50), default='Available')
    avatar = Column(String(255), nullable=True)

class TeamNote(Base):
    __tablename__ = 'team_notes'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey('customers.customer_id'), nullable=False)
    author = Column(String(100), nullable=False)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    customer = relationship('Customer', back_populates='team_notes')

class AIAnalysis(Base):
    __tablename__ = 'ai_analysis'
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(50), ForeignKey('tickets.ticket_id'), unique=True, nullable=False)
    intent = Column(String(100), nullable=False)
    subcategory = Column(String(100), nullable=True)
    emotion = Column(String(50), nullable=False)
    emotion_confidence = Column(Float, default=0.85)
    urgency = Column(String(50), default='Normal')
    confidence = Column(Float, default=0.9)
    decision = Column(String(50), nullable=False)  # RESOLUTION_READY, NEEDS_INFORMATION, ESCALATION_REQUIRED
    success_probability = Column(Float, default=0.88)
    missing_information = Column(JSON, default=list)
    recommended_articles = Column(JSON, default=list)
    specialist = Column(String(100), nullable=True)
    specialist_match = Column(Float, default=0.0)
    draft_response = Column(Text, nullable=True)
    reason = Column(Text, nullable=True)
    evidence = Column(JSON, default=list)
    next_best_actions = Column(JSON, default=list)
    quality_score = Column(Float, default=95.0)
    quality_factors = Column(JSON, default=dict)
    processing_time = Column(Float, default=0.42)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    ticket = relationship('Ticket', back_populates='ai_analysis')

class AuditLog(Base):
    __tablename__ = 'audit_logs'
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(50), ForeignKey('tickets.ticket_id'), nullable=False)
    action = Column(String(100), nullable=False)  # Approve & Send, Ask Customer, Escalate, Customize, etc.
    actor_type = Column(String(50), default='agent')  # agent, supervisor, system
    actor_id = Column(String(100), default='agent_demo')
    action_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    ticket = relationship('Ticket', back_populates='audit_logs')
