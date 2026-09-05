from typing import Dict, Any, List

def compute_customer_health(
    open_tickets_count: int,
    unresolved_past_tickets: int,
    current_emotion: str,
    customer_priority: str,
    data_usage_gb: float,
    is_outage: bool
) -> Dict[str, Any]:
    '''
    Computes transparent rule-based risk indicator (0.0 to 10.0) and health classification.
    '''
    risk_score = 1.5
    factors = []

    if customer_priority in ['VIP', 'High']:
        risk_score += 1.0
        factors.append('High-value VIP account profile')

    if open_tickets_count > 1:
        risk_score += 2.0
        factors.append(f'Multiple open tickets ({open_tickets_count})')
    elif open_tickets_count == 1:
        risk_score += 1.0

    if unresolved_past_tickets > 0:
        risk_score += 2.5
        factors.append('Previous unresolved ticket history')

    if current_emotion == 'Angry':
        risk_score += 2.5
        factors.append('Customer expressing acute anger/frustration')
    elif current_emotion == 'Frustrated':
        risk_score += 1.8
        factors.append('Customer expressing billing or service frustration')

    if is_outage:
        risk_score += 1.5
        factors.append('Affected by ongoing area outage or prolonged disruption')

    if data_usage_gb > 400:
        risk_score += 0.7
        factors.append('Heavy broadband data utilization (near plan ceiling)')

    final_risk = min(10.0, max(0.5, round(risk_score, 1)))

    if final_risk >= 8.0:
        health_status = 'High Attention'
        recommended_action = 'Senior agent review + Priority callback'
    elif final_risk >= 5.0:
        health_status = 'Attention'
        recommended_action = 'Proactive follow-up & expedited resolution'
    elif final_risk >= 3.0:
        health_status = 'Stable'
        recommended_action = 'Standard SLA monitoring'
    else:
        health_status = 'Good'
        recommended_action = 'Automated courtesy check'

    return {
        'risk_score': final_risk,
        'health_status': health_status,
        'risk_factors': factors,
        'recommended_action': recommended_action
    }
