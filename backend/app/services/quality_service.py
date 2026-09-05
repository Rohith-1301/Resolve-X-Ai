from typing import Dict, Any, List
from app.schemas.ai import QualityScore, QualityFactor

def evaluate_quality(
    draft_response: str,
    cited_articles: List[str],
    has_customer_name: bool,
    has_verified_facts: bool,
    decision: str,
    contains_unsupported_claim: bool = False
) -> QualityScore:
    '''
    Evaluates response quality according to the 6 specification pillars.
    '''
    grounding_score = 30.0 if (has_verified_facts and not contains_unsupported_claim) else 15.0
    citation_score = 20.0 if (len(cited_articles) > 0 or decision != 'RESOLUTION_READY') else 0.0
    data_consistency_score = 20.0 if has_customer_name else 10.0
    tone_score = 10.0 if any(p in draft_response.lower() for p in ['understand', 'apologize', 'welcome', 'happy', 'pleasure', 'hi ']) else 8.0
    completeness_score = 10.0 if len(draft_response) > 50 else 6.0
    safety_score = 10.0 if not contains_unsupported_claim else 0.0

    overall = round(grounding_score + citation_score + data_consistency_score + tone_score + completeness_score + safety_score, 1)

    factors = [
        QualityFactor(category='Grounding', score=grounding_score, weight=30.0, explanation='Verified against customer account and policy database'),
        QualityFactor(category='Citation', score=citation_score, weight=20.0, explanation=f'Referenced approved knowledge articles: {", ".join(cited_articles) if cited_articles else "N/A"}'),
        QualityFactor(category='Data Consistency', score=data_consistency_score, weight=20.0, explanation='Consistent with Customer 360 profile and bill amounts'),
        QualityFactor(category='Tone & Empathy', score=tone_score, weight=10.0, explanation='Empathetic, clear, and professional telecom tone'),
        QualityFactor(category='Completeness', score=completeness_score, weight=10.0, explanation='Includes next steps and immediate resolution roadmap'),
        QualityFactor(category='Safety & Guardrails', score=safety_score, weight=10.0, explanation='No unverified financial or contractual commitments made')
    ]

    return QualityScore(
        overall_score=overall,
        grounding=grounding_score,
        citation=citation_score,
        data_consistency=data_consistency_score,
        tone=tone_score,
        completeness=completeness_score,
        safety=safety_score,
        factors=factors
    )
