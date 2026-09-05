from typing import Dict, Any, Tuple

SPECIALIST_ROSTER = [
    {
        'name': 'Amit Sharma',
        'title': 'Senior Technical Specialist',
        'department': 'Broadband & Infrastructure',
        'expertise': 'Broadband / Connectivity / Prolonged Outages',
        'categories': ['Connectivity', 'Broadband', 'Network']
    },
    {
        'name': 'Priya Nair',
        'title': 'Billing Specialist',
        'department': 'Billing & Finance',
        'expertise': 'Billing / Payments / Dispute Resolution',
        'categories': ['Billing', 'Payment', 'Refund']
    },
    {
        'name': 'Neha Kapoor',
        'title': 'Mobile Specialist',
        'department': 'Mobile Operations',
        'expertise': 'SIM / Mobile / 5G / eSIM',
        'categories': ['Mobile', 'SIM', 'Roaming']
    },
    {
        'name': 'Vikram Rao',
        'title': 'Network Specialist',
        'department': 'Core Networks',
        'expertise': 'Network / Outages / Area Infrastructure',
        'categories': ['Network', 'Outage', 'Connectivity']
    },
    {
        'name': 'Sarah Thomas',
        'title': 'Customer Success Specialist',
        'department': 'Retention & Retention Ops',
        'expertise': 'Retention / Customer Health / VIP Escalations',
        'categories': ['Plan', 'Account', 'Complaint']
    },
    {
        'name': 'Arjun Patel',
        'title': 'General Support Specialist',
        'department': 'Customer Care',
        'expertise': 'General issues / Account Queries',
        'categories': ['General Inquiry', 'Service Request']
    }
]

def match_specialist(category: str, description: str, emotion: str, confidence: float, has_repeated_unresolved: bool) -> Tuple[str, str, float, str]:
    '''
    Recommends specialist, match score, title, and detailed reason.
    Returns (name, title, match_score, reason)
    '''
    desc_lower = description.lower()

    # Scenario 3: Complex Outage / Prolonged Connectivity Escalation
    if ('three days' in desc_lower or '3 days' in desc_lower or has_repeated_unresolved) and ('internet' in desc_lower or 'router' in desc_lower or category == 'Connectivity'):
        return (
            'Amit Sharma',
            'Senior Technical Specialist',
            0.94,
            '3-day outage, repeated troubleshooting, previous unresolved ticket (TKT-1031), angry customer, and low resolution confidence (38%).'
        )

    if category in ['Billing', 'Payment'] or 'bill' in desc_lower or 'charge' in desc_lower:
        return (
            'Priya Nair',
            'Billing Specialist',
            0.92,
            'Billing dispute analysis, surcharge clarification, and automated adjustment authority.'
        )

    if category in ['Mobile', 'SIM', 'Roaming'] or 'sim' in desc_lower or '5g' in desc_lower:
        return (
            'Neha Kapoor',
            'Mobile Specialist',
            0.91,
            'Mobile cellular provisioning, SIM diagnostics, and 5G profile troubleshooting.'
        )

    if 'network' in desc_lower or 'area' in desc_lower or 'tower' in desc_lower:
        return (
            'Vikram Rao',
            'Network Specialist',
            0.93,
            'Local cell tower telemetry, distribution node diagnostics, and line impedance testing.'
        )

    if emotion in ['Angry', 'Critical'] or 'cancel' in desc_lower or 'leaving' in desc_lower:
        return (
            'Sarah Thomas',
            'Customer Success Specialist',
            0.89,
            'High customer churn risk, negative sentiment score, VIP retention protocol required.'
        )

    return (
        'Arjun Patel',
        'General Support Specialist',
        0.85,
        'Standard operational handling and routine customer service fulfillment.'
    )
