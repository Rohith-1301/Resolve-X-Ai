from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import ProactiveAlert, ProactiveAction, Customer, Account, Ticket

def get_alert_affected_preview(db: Session, alert_id: str) -> List[Dict[str, Any]]:
    '''
    Generates realistic affected customer cohort for Mumbai Tower 3 (234 affected customers).
    '''
    # We return representative affected customer records with consistent data
    return [
        {
            'customer_id': 'CUS-1001',
            'name': 'Rahul Kumar',
            'priority': 'VIP',
            'plan_name': 'Fiber 500 Mbps',
            'ticket_id': 'TKT-1042',
            'emotion': 'Angry',
            'risk': 'High',
            'recommended_action': 'Priority callback & service credit review'
        },
        {
            'customer_id': 'CUS-1003',
            'name': 'Arjun Mehta',
            'priority': 'High',
            'plan_name': 'Fiber 300 Mbps',
            'ticket_id': 'TKT-1044',
            'emotion': 'Angry',
            'risk': 'Critical',
            'recommended_action': 'Senior specialist direct dispatch'
        },
        {
            'customer_id': 'CUS-1004',
            'name': 'Sunita Patel',
            'priority': 'Standard',
            'plan_name': 'Fiber 100 Mbps',
            'ticket_id': 'TKT-1045',
            'emotion': 'Frustrated',
            'risk': 'Medium',
            'recommended_action': 'Automated status SMS notification'
        },
        {
            'customer_id': 'CUS-1005',
            'name': 'Karan Verma',
            'priority': 'Standard',
            'plan_name': 'Fiber 200 Mbps',
            'ticket_id': None,
            'emotion': 'Neutral',
            'risk': 'Low',
            'recommended_action': 'Proactive notification prior to complaint'
        },
        {
            'customer_id': 'CUS-1006',
            'name': 'Ananya Roy',
            'priority': 'VIP',
            'plan_name': 'Fiber 1 Gbps',
            'ticket_id': 'TKT-1048',
            'emotion': 'Concerned',
            'risk': 'High',
            'recommended_action': 'Dedicated account manager briefing'
        },
        {
            'customer_id': 'CUS-1007',
            'name': 'Devendra Singh',
            'priority': 'High',
            'plan_name': 'Fiber 500 Mbps',
            'ticket_id': None,
            'emotion': 'Neutral',
            'risk': 'Medium',
            'recommended_action': 'Scheduled outage advisory'
        }
    ]

def get_proactive_alert_detail(db: Session, alert_id: str) -> Optional[Dict[str, Any]]:
    alert = db.query(ProactiveAlert).filter(ProactiveAlert.alert_id == alert_id).first()
    if not alert:
        return None

    actions = db.query(ProactiveAction).filter(ProactiveAction.alert_id == alert_id).all()
    preview_customers = get_alert_affected_preview(db, alert_id)

    return {
        'id': alert.id,
        'alert_id': alert.alert_id,
        'alert_type': alert.alert_type,
        'title': alert.title,
        'description': alert.description,
        'location': alert.location,
        'affected_customers': alert.affected_customers,
        'severity': alert.severity,
        'status': alert.status,
        'estimated_resolution': alert.estimated_resolution,
        'created_at': alert.created_at,
        'actions': [
            {
                'id': a.id,
                'alert_id': a.alert_id,
                'action_type': a.action_type,
                'content': a.content,
                'status': a.status,
                'approved_by': a.approved_by,
                'approved_at': a.approved_at
            } for a in actions
        ],
        'affected_list_preview': preview_customers
    }
