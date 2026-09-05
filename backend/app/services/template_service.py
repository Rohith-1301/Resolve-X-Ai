from typing import List, Dict, Any

TEMPLATES = [
    {
        'id': 'tpl_billing_frustrated',
        'title': 'Frustrated Customer — Billing Discrepancy',
        'category': 'Billing',
        'tone': 'Empathetic & Fact-based',
        'match_score': 0.94,
        'content': 'Hi {customer_name}, I understand why the ₹{total_amount} bill looks unexpected compared to your ₹{plan_price} {plan_name} plan. Our billing records show a separate ₹{additional_amount} charge for {charge_reason}. As outlined in our billing guidelines ({citation}), this is calculated separately from your monthly plan. I am happy to review this charge with you.'
    },
    {
        'id': 'tpl_technical_angry',
        'title': 'Angry Customer — Technical Outage / Escalation',
        'category': 'Connectivity',
        'tone': 'Urgent & Apologetic',
        'match_score': 0.92,
        'content': 'Hi {customer_name}, I sincerely apologize for the prolonged service disruption you have experienced over the last {duration}. Having restarted your router without success, I have prioritized this issue and escalated your case directly to our Senior Technical Specialist, {specialist_name}, for an immediate diagnostic and callback.'
    },
    {
        'id': 'tpl_missing_info_conn',
        'title': 'Missing Information — Connectivity Scope',
        'category': 'Connectivity',
        'tone': 'Inquisitive & Helpful',
        'match_score': 0.90,
        'content': 'Hi {customer_name}, I am here to help get your internet restored right away. To help us pinpoint whether the issue is with the modem signal or local Wi-Fi distribution, is the issue affecting all devices connected to your Wi-Fi, or only one device?'
    },
    {
        'id': 'tpl_network_outage',
        'title': 'Proactive — Area Network Maintenance',
        'category': 'Network',
        'tone': 'Informative & Reassuring',
        'match_score': 0.88,
        'content': 'Hi {customer_name}, our network operations center is actively addressing a technical issue at {location}. Field engineers are on site, and broadband service is expected to be fully restored within {estimated_time}. We appreciate your patience.'
    },
    {
        'id': 'tpl_plan_upgrade',
        'title': 'Proactive — High Usage Plan Upgrade',
        'category': 'Plan',
        'tone': 'Consultative & Value-driven',
        'match_score': 0.85,
        'content': 'Hi {customer_name}, we noticed your account frequently utilizes over {usage_gb} GB each month with multiple connected devices. Upgrading to {recommended_plan} would ensure continuous ultra-fast speeds without throttling during peak hours.'
    },
    {
        'id': 'tpl_payment_failed',
        'title': 'Payment Failure — Clarification',
        'category': 'Payment',
        'tone': 'Supportive & Clear',
        'match_score': 0.87,
        'content': 'Hi {customer_name}, we noticed your latest payment of ₹{amount} could not be processed by your bank. Your service remains active during this grace period. You can safely retry payment via your customer portal.'
    }
]

def get_templates_for_ticket(category: str, emotion: str, decision: str) -> List[Dict[str, Any]]:
    results = []
    for t in TEMPLATES:
        match = t['match_score']
        if t['category'].lower() == category.lower():
            match += 0.05
        results.append({
            **t,
            'match_score': min(0.98, round(match, 2))
        })
    results.sort(key=lambda x: x['match_score'], reverse=True)
    return results
