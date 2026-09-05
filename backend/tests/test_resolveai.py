import pytest
from app.db.database import SessionLocal
from app.models.models import Customer, Account, Ticket, KnowledgeArticle, ProactiveAlert
from app.services.intent_service import detect_intent
from app.services.sentiment_service import analyze_sentiment
from app.services.rag_service import retrieve_knowledge
from app.services.decision_engine import evaluate_decision
from app.services.ai_service import analyze_ticket
from app.services.predictive_service import get_usage_opportunities

@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    yield session
    session.close()

def test_intent_detection():
    # Billing
    cat, subcat, conf = detect_intent("My bill is ₹1,499 but my plan is ₹999. This is wrong!")
    assert cat == "Billing"
    assert subcat == "Unexpected Charge"
    assert conf >= 0.85

    # Connectivity
    cat2, subcat2, conf2 = detect_intent("My internet isn't working.")
    assert cat2 == "Connectivity"

    # Mobile SIM
    cat3, subcat3, conf3 = detect_intent("Need to activate my new eSIM profile on my phone")
    assert cat3 == "Mobile"

def test_sentiment_analysis():
    # Frustrated
    emot, conf, score, urgency = analyze_sentiment("My bill is ₹1,499 but my plan is ₹999. This is wrong!")
    assert emot == "Frustrated"
    assert conf >= 0.80

    # Angry 3-day outage
    emot2, conf2, score2, urgency2 = analyze_sentiment("My internet has been down for three days. I already restarted my router twice and contacted support yesterday.")
    assert emot2 == "Angry"
    assert conf2 >= 0.90
    assert urgency2 == "Critical"

    # Concerned
    emot3, conf3, score3, urgency3 = analyze_sentiment("My internet isn't working.")
    assert emot3 == "Concerned"

def test_knowledge_retrieval(db):
    results = retrieve_knowledge(query="additional charges on monthly bill 1,499", category="Billing", db=db)
    assert len(results) > 0
    assert results[0]["article_id"] == "KB-102"
    assert results[0]["title"] == "Understanding Additional Charges"

def test_decision_engine():
    # Resolution Ready
    dec1, missing1, q1, r1 = evaluate_decision(
        category="Billing", subcategory="Unexpected Charge",
        message_text="Why is my bill higher?", confidence=0.94,
        has_kb=True, kb_relevance=0.96, has_repeated_unresolved=False,
        days_down=0, emotion="Frustrated", emotion_confidence=0.85
    )
    assert dec1 == "RESOLUTION_READY"

    # Needs Information
    dec2, missing2, q2, r2 = evaluate_decision(
        category="Connectivity", subcategory="Internet Down",
        message_text="My internet isn't working.", confidence=0.72,
        has_kb=True, kb_relevance=0.85, has_repeated_unresolved=False,
        days_down=0, emotion="Concerned", emotion_confidence=0.80
    )
    assert dec2 == "NEEDS_INFORMATION"
    assert "Scope of affected devices" in missing2
    assert "all devices connected to your Wi-Fi" in q2

    # Escalation Required
    dec3, missing3, q3, r3 = evaluate_decision(
        category="Connectivity", subcategory="Internet Down",
        message_text="My internet has been down for three days.", confidence=0.38,
        has_kb=True, kb_relevance=0.70, has_repeated_unresolved=True,
        days_down=3, emotion="Angry", emotion_confidence=0.92
    )
    assert dec3 == "ESCALATION_REQUIRED"

def test_demo_scenario_1_analysis(db):
    result = analyze_ticket("TKT-1042", db)
    assert result.decision == "RESOLUTION_READY"
    assert result.confidence >= 0.90
    assert "KB-102" in result.recommended_articles
    assert "Rahul" in result.draft_response
    assert "₹500" in result.draft_response
    assert result.quality.overall_score >= 90.0

def test_demo_scenario_2_analysis(db):
    from app.models.models import Message
    t = db.query(Ticket).filter(Ticket.ticket_id == "TKT-1043").first()
    db.query(Message).filter(Message.conversation_id == t.conversation_id, Message.id > 2).delete()
    db.commit()
    result = analyze_ticket("TKT-1043", db)
    assert result.decision == "NEEDS_INFORMATION"
    assert result.suggested_question is not None
    assert "all devices" in result.suggested_question

def test_demo_scenario_3_analysis(db):
    result = analyze_ticket("TKT-1044", db)
    assert result.decision == "ESCALATION_REQUIRED"
    assert result.specialist == "Amit Sharma"
    assert result.handoff_summary is not None
    assert result.handoff_summary["previous_ticket"] == "TKT-1031"

def test_proactive_alert(db):
    alert = db.query(ProactiveAlert).filter(ProactiveAlert.alert_id == "ALT-1001").first()
    assert alert is not None
    assert alert.affected_customers == 234

def test_predictive_opportunity():
    opps = get_usage_opportunities()
    assert len(opps) > 0
    rahul_opp = next(o for o in opps if o["customer_id"] == "CUS-1001")
    assert rahul_opp["opportunity_score"] == 0.73
    assert rahul_opp["recommended_plan"] == "Fiber 1 Gbps (Unlimited)"
