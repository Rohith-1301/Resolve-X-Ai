from typing import Dict, Any, List

def calculate_resolution_confidence(
    has_kb: bool,
    kb_relevance: float,
    account_complete: bool,
    is_routine: bool,
    has_repeated_unresolved: bool,
    has_prolonged_outage: bool,
    is_extreme_anger: bool,
    previous_resolved: bool
) -> float:
    '''
    Calculates deterministic AI resolution confidence score (0.0 to 1.0).
    '''
    confidence = 0.50

    if has_kb and kb_relevance >= 0.70:
        confidence += 0.20
    elif not has_kb:
        confidence -= 0.20

    if account_complete:
        confidence += 0.10

    if is_routine:
        confidence += 0.10

    if previous_resolved:
        confidence += 0.05

    if has_repeated_unresolved:
        confidence -= 0.15

    if has_prolonged_outage:
        confidence -= 0.20

    if is_extreme_anger:
        confidence -= 0.10

    # Ensure bounds
    return max(0.05, min(0.98, round(confidence, 2)))

def calculate_success_probability(confidence: float, customer_health_score: float, decision: str) -> float:
    '''
    Calculates AI-assisted resolution likelihood (0.0 to 1.0).
    '''
    if decision == 'ESCALATION_REQUIRED':
        return round(max(0.15, confidence * 0.7), 2)
    elif decision == 'NEEDS_INFORMATION':
        return round(max(0.60, min(0.85, confidence * 0.9 + 0.1)), 2)
    else:  # RESOLUTION_READY
        return round(min(0.96, max(0.85, confidence * 0.95 + 0.02)), 2)
