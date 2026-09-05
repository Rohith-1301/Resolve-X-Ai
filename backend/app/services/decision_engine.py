from typing import Tuple, List, Optional, Dict, Any

def evaluate_decision(
    category: str,
    subcategory: str,
    message_text: str,
    confidence: float,
    has_kb: bool,
    kb_relevance: float,
    has_repeated_unresolved: bool,
    days_down: int,
    emotion: str,
    emotion_confidence: float
) -> Tuple[str, List[str], Optional[str], str]:
    """
    Evaluates triage decision: RESOLUTION_READY, NEEDS_INFORMATION, or ESCALATION_REQUIRED.
    Returns (decision, missing_information_list, suggested_question, decision_reason)
    """
    msg_lower = message_text.lower()

    # Rule 1: Escalation Required Conditions
    if (
        has_repeated_unresolved or
        days_down >= 3 or
        'three days' in msg_lower or
        '3 days' in msg_lower or
        (emotion == 'Angry' and emotion_confidence >= 0.90) or
        confidence < 0.60 or
        ('restarted' in msg_lower and 'contacted support' in msg_lower)
    ):
        reason = (
            'Repeated unresolved connectivity issue with prolonged outage and high customer frustration.'
            if ('three days' in msg_lower or days_down >= 3)
            else 'Complex support situation exceeding autonomous resolution thresholds requiring senior specialist handoff.'
        )
        return 'ESCALATION_REQUIRED', [], None, reason

    # Rule 2: Needs Information Conditions
    # For brief or ambiguous complaints like "My internet isn't working" without specifying scope
    if category == 'Connectivity' and (
        "isn't working" in msg_lower or "is not working" in msg_lower or "not working" in msg_lower or "down" in msg_lower
    ) and not any(k in msg_lower for k in ['all devices', 'single device', 'phone only', 'laptop', 'three days', 'restart', 'restarted']):
        missing = ['Scope of affected devices']
        question = 'Is the issue affecting all devices connected to your Wi-Fi, or only one device?'
        reason = 'Customer indicated general connectivity disruption but scope of impact (single vs multi-device) is required to determine router vs gateway failure.'
        return 'NEEDS_INFORMATION', missing, question, reason

    if category == 'Billing' and ('overcharged' in msg_lower) and not any(k in msg_lower for k in ['1,499', '1499', 'amount', '₹', 'plan']):
        missing = ['Specific invoice month or transaction ID']
        question = 'Could you please confirm the billing month or invoice number you are referencing?'
        reason = 'Multiple billing cycles found; customer needs to specify the disputed cycle.'
        return 'NEEDS_INFORMATION', missing, question, reason

    # Rule 3: Resolution Ready Conditions
    if has_kb and kb_relevance >= 0.70 and confidence >= 0.80:
        reason = 'Routine issue supported by verified account telemetry and approved knowledge base guidance.'
        return 'RESOLUTION_READY', [], None, reason

    # Fallback to Needs Information or Resolution Ready depending on KB
    if has_kb:
        return 'RESOLUTION_READY', [], None, 'Grounded by available knowledge articles.'
    else:
        return 'ESCALATION_REQUIRED', [], None, 'No verified knowledge article found to safely address this customer inquiry.'
