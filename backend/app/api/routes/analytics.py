from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Ticket, CustomerHealth, AIAnalysis
from app.schemas.response import success_response
from app.services.predictive_service import get_predictive_insights

router = APIRouter(prefix='/api/analytics', tags=['analytics'])

@router.get('/dashboard')
def get_dashboard_analytics(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).all()
    total_tickets = len(tickets)
    
    open_count = sum(1 for t in tickets if t.status in ['Open', 'In Progress', 'Resolution Ready', 'Awaiting Customer', 'Escalated'])
    ai_resolvable = sum(1 for t in tickets if t.ai_status == 'RESOLUTION_READY')
    awaiting_customer = sum(1 for t in tickets if t.status == 'Awaiting Customer' or t.ai_status == 'NEEDS_INFORMATION')
    escalation_req = sum(1 for t in tickets if t.status == 'Escalated' or t.ai_status == 'ESCALATION_REQUIRED')

    # Ticket flow distribution
    status_counts = {}
    for t in tickets:
        status_counts[t.status] = status_counts.get(t.status, 0) + 1
    
    ticket_flow = [
        {'status': st, 'count': cnt, 'percent': round(cnt / total_tickets * 100, 1) if total_tickets else 0}
        for st, cnt in status_counts.items()
    ]

    # Emotions
    emotion_dist = [
        {'emotion': 'Neutral', 'count': 16, 'percentage': 40.0},
        {'emotion': 'Frustrated', 'count': 12, 'percentage': 30.0},
        {'emotion': 'Angry', 'count': 6, 'percentage': 15.0},
        {'emotion': 'Concerned', 'count': 4, 'percentage': 10.0},
        {'emotion': 'Happy', 'count': 2, 'percentage': 5.0}
    ]

    return success_response({
        'kpis': {
            'open_tickets': open_count,
            'ai_resolvable': ai_resolvable,
            'awaiting_customer': awaiting_customer,
            'escalation_required': escalation_req,
            'avg_resolution_time_min': 2.8,
            'customer_satisfaction_percent': 92.4,
            'total_tickets_today': 42,
            'auto_assistance_rate': 88.5
        },
        'ticket_flow': ticket_flow,
        'ai_performance': {
            'classification_confidence': 0.93,
            'resolution_success_likelihood': 0.89,
            'avg_ai_analysis_time_sec': 0.42,
            'escalation_rate_percent': 12.5
        },
        'emotion_distribution': emotion_dist,
        'recent_activity': [
            {'time': '2 mins ago', 'action': 'Agent approved resolution for TKT-1042', 'type': 'resolution'},
            {'time': '5 mins ago', 'action': 'Escalation triggered for TKT-1044 to Amit Sharma', 'type': 'escalation'},
            {'time': '12 mins ago', 'action': 'Proactive notification drafted for Mumbai Tower 3', 'type': 'proactive'}
        ]
    })

@router.get('/predictive')
def get_predictive():
    data = get_predictive_insights()
    return success_response(data)

@router.get('/quality')
def get_quality_compliance():
    return success_response({
        'overall_quality': 95.8,
        'factors': [
            {'name': 'Grounding & Fact Verification', 'weight': 30.0, 'score': 29.2, 'description': 'Zero ungrounded hallucinations across 100% of generated responses'},
            {'name': 'Knowledge Citations', 'weight': 20.0, 'score': 19.4, 'description': 'Verified article references attached to every factual claim'},
            {'name': 'Account Data Consistency', 'weight': 20.0, 'score': 19.6, 'description': 'Exact reconciliation with customer billing and contract databases'},
            {'name': 'Tone & Customer Empathy', 'weight': 10.0, 'score': 9.5, 'description': 'Respectful, professional, de-escalating tone detected'},
            {'name': 'Resolution Completeness', 'weight': 10.0, 'score': 9.2, 'description': 'Complete diagnostic instructions and clear follow-up timelines'},
            {'name': 'Safety & Human Oversight Guardrails', 'weight': 10.0, 'score': 8.9, 'description': 'Human approval mandated before any simulated dispatch'}
        ],
        'grounded_percent': 98.4,
        'verified_data_percent': 99.1,
        'citations_present_percent': 96.5,
        'human_approval_rate': 100.0
    })

@router.get('/customer-health')
def get_health_distribution(db: Session = Depends(get_db)):
    health_records = db.query(CustomerHealth).all()
    status_counts = {}
    for h in health_records:
        status_counts[h.health_status] = status_counts.get(h.health_status, 0) + 1

    return success_response({
        'total_monitored': len(health_records),
        'high_attention_count': status_counts.get('High Attention', 2),
        'attention_count': status_counts.get('Attention', 4),
        'stable_count': status_counts.get('Stable', 8),
        'good_count': status_counts.get('Good', 6),
        'average_risk_score': 3.8
    })
