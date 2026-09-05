from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Customer, Account, Ticket, Conversation, Message, CustomerUsage, CustomerHealth, CustomerJourneyEvent, TeamNote
from app.schemas.response import success_response, error_response
from app.schemas.customer import Customer360Response, CustomerSchema, AccountSchema, CustomerUsageSchema, CustomerHealthSchema, CustomerJourneyEventSchema, TeamNoteSchema

router = APIRouter(prefix='/api/customers', tags=['customers'])

@router.get('')
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).order_by(Customer.customer_id.asc()).all()
    results = []
    for c in customers:
        acc = db.query(Account).filter(Account.customer_id == c.customer_id).first()
        hlth = db.query(CustomerHealth).filter(CustomerHealth.customer_id == c.customer_id).first()
        results.append({
            'customer_id': c.customer_id,
            'name': c.name,
            'email': c.email,
            'phone': c.phone,
            'address': c.address,
            'customer_type': c.customer_type,
            'priority': c.priority,
            'tags': c.tags or [],
            'plan_name': acc.plan_name if acc else 'None',
            'monthly_price': acc.monthly_price if acc else 0,
            'billing_status': acc.billing_status if acc else 'Unknown',
            'risk_score': hlth.risk_score if hlth else 2.0,
            'health_status': hlth.health_status if hlth else 'Good'
        })
    return success_response(results)

@router.get('/{customer_id}')
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    c = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not c:
        raise HTTPException(status_code=404, detail='Customer not found')
    acc = db.query(Account).filter(Account.customer_id == customer_id).first()
    return success_response({
        'customer_id': c.customer_id,
        'name': c.name,
        'email': c.email,
        'phone': c.phone,
        'address': c.address,
        'customer_type': c.customer_type,
        'priority': c.priority,
        'tags': c.tags or [],
        'account': {
            'account_number': acc.account_number,
            'plan_name': acc.plan_name,
            'monthly_price': acc.monthly_price,
            'billing_status': acc.billing_status
        } if acc else None
    })

@router.get('/{customer_id}/360')
def get_customer_360(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail='Customer not found')

    accounts = db.query(Account).filter(Account.customer_id == customer_id).all()
    tickets = db.query(Ticket).filter(Ticket.customer_id == customer_id).order_by(Ticket.created_at.desc()).all()
    usage = db.query(CustomerUsage).filter(CustomerUsage.customer_id == customer_id).first()
    health = db.query(CustomerHealth).filter(CustomerHealth.customer_id == customer_id).first()
    journey = db.query(CustomerJourneyEvent).filter(CustomerJourneyEvent.customer_id == customer_id).all()
    notes = db.query(TeamNote).filter(TeamNote.customer_id == customer_id).all()
    conversations = db.query(Conversation).filter(Conversation.customer_id == customer_id).all()

    current_tickets = []
    previous_tickets = []
    for t in tickets:
        t_dict = {
            'ticket_id': t.ticket_id,
            'subject': t.subject,
            'category': t.category,
            'status': t.status,
            'priority': t.priority,
            'created_at': str(t.created_at),
            'ai_status': t.ai_status,
            'specialist': t.specialist
        }
        if t.status in ['Open', 'In Progress', 'Resolution Ready', 'Awaiting Customer', 'Escalated']:
            current_tickets.append(t_dict)
        else:
            previous_tickets.append(t_dict)

    conv_list = []
    sentiment_history = []
    for conv in conversations:
        msgs = db.query(Message).filter(Message.conversation_id == conv.conversation_id).all()
        conv_list.append({
            'conversation_id': conv.conversation_id,
            'channel': conv.channel,
            'message_count': len(msgs),
            'status': conv.status
        })
        for m in msgs:
            if m.sender_type == 'customer':
                sentiment_history.append({
                    'message_snippet': m.message_text[:40] + '...',
                    'emotion': m.emotion,
                    'score': m.sentiment_score,
                    'urgency': m.urgency
                })

    rec_action = health.recommended_action if health else 'Standard SLA check-in'

    return success_response({
        'profile': {
            'id': customer.id,
            'customer_id': customer.customer_id,
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone,
            'address': customer.address,
            'customer_type': customer.customer_type,
            'priority': customer.priority,
            'tags': customer.tags or [],
            'created_at': customer.created_at
        },
        'accounts': [
            {
                'id': a.id,
                'customer_id': a.customer_id,
                'account_number': a.account_number,
                'service_type': a.service_type,
                'plan_name': a.plan_name,
                'monthly_price': a.monthly_price,
                'additional_charges': a.additional_charges,
                'billing_status': a.billing_status,
                'service_status': a.service_status,
                'account_status': a.account_status,
                'contract_start': a.contract_start,
                'contract_end': a.contract_end
            } for a in accounts
        ],
        'current_tickets': current_tickets,
        'previous_tickets': previous_tickets,
        'conversations': conv_list,
        'usage': {
            'id': usage.id,
            'customer_id': usage.customer_id,
            'period': usage.period,
            'data_usage_gb': usage.data_usage_gb,
            'mobile_usage_gb': usage.mobile_usage_gb,
            'connected_devices': usage.connected_devices,
            'peak_usage_start': usage.peak_usage_start,
            'peak_usage_end': usage.peak_usage_end,
            'usage_pattern': usage.usage_pattern,
            'hotspot_usage': usage.hotspot_usage
        } if usage else None,
        'health': {
            'customer_id': health.customer_id,
            'risk_score': health.risk_score,
            'health_status': health.health_status,
            'risk_factors': health.risk_factors or [],
            'recommended_action': health.recommended_action,
            'updated_at': health.updated_at
        } if health else None,
        'journey': [
            {
                'id': j.id,
                'customer_id': j.customer_id,
                'event_type': j.event_type,
                'title': j.title,
                'description': j.description,
                'event_date': j.event_date,
                'severity': j.severity
            } for j in journey
        ],
        'sentiment_history': sentiment_history,
        'recommended_action': rec_action,
        'knowledge_interactions': [
            {'article_id': 'KB-102', 'title': 'Understanding Additional Charges', 'viewed_at': '2 days ago'}
        ],
        'team_notes': [
            {
                'id': n.id,
                'customer_id': n.customer_id,
                'author': n.author,
                'note': n.note,
                'created_at': n.created_at
            } for n in notes
        ]
    })

@router.get('/{customer_id}/journey')
def get_customer_journey(customer_id: str, db: Session = Depends(get_db)):
    events = db.query(CustomerJourneyEvent).filter(CustomerJourneyEvent.customer_id == customer_id).all()
    return success_response([
        {
            'id': e.id,
            'customer_id': e.customer_id,
            'event_type': e.event_type,
            'title': e.title,
            'description': e.description,
            'event_date': e.event_date,
            'severity': e.severity
        } for e in events
    ])

@router.get('/{customer_id}/health')
def get_customer_health(customer_id: str, db: Session = Depends(get_db)):
    health = db.query(CustomerHealth).filter(CustomerHealth.customer_id == customer_id).first()
    if not health:
        raise HTTPException(status_code=404, detail='Health record not found')
    return success_response({
        'customer_id': health.customer_id,
        'risk_score': health.risk_score,
        'health_status': health.health_status,
        'risk_factors': health.risk_factors,
        'recommended_action': health.recommended_action
    })

@router.get('/{customer_id}/usage')
def get_customer_usage(customer_id: str, db: Session = Depends(get_db)):
    usage = db.query(CustomerUsage).filter(CustomerUsage.customer_id == customer_id).first()
    if not usage:
        raise HTTPException(status_code=404, detail='Usage record not found')
    return success_response({
        'customer_id': usage.customer_id,
        'period': usage.period,
        'data_usage_gb': usage.data_usage_gb,
        'mobile_usage_gb': usage.mobile_usage_gb,
        'connected_devices': usage.connected_devices,
        'peak_usage_start': usage.peak_usage_start,
        'peak_usage_end': usage.peak_usage_end,
        'usage_pattern': usage.usage_pattern,
        'hotspot_usage': usage.hotspot_usage
    })
