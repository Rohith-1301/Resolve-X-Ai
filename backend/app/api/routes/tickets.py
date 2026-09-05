import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Ticket, Customer, Account, Conversation, Message, AIAnalysis, AuditLog
from app.schemas.response import success_response, error_response
from app.schemas.ticket import ApproveResponseRequest, AskCustomerRequest, EscalateRequest, CustomerReplyRequest, SpecialistActionRequest
from app.services.ai_service import analyze_ticket

router = APIRouter(prefix='/api/tickets', tags=['tickets'])

@router.get('')
def get_tickets(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    ai_status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    specialist: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Ticket)

    if status and status != 'All':
        query = query.filter(Ticket.status == status)
    if priority and priority != 'All':
        query = query.filter(Ticket.priority == priority)
    if ai_status and ai_status != 'All':
        query = query.filter(Ticket.ai_status == ai_status)
    if category and category != 'All':
        query = query.filter(Ticket.category == category)
    if specialist and specialist != 'All':
        query = query.filter(Ticket.specialist == specialist)

    tickets = query.order_by(Ticket.updated_at.desc()).all()
    results = []

    for t in tickets:
        cust = db.query(Customer).filter(Customer.customer_id == t.customer_id).first()
        
        # Determine latest emotion
        conv = db.query(Conversation).filter(Conversation.conversation_id == t.conversation_id).first()
        latest_msg = None
        if conv and conv.messages:
            latest_msg = conv.messages[-1]

        # Search filter
        if search:
            s_lower = search.lower()
            match_tkt = s_lower in t.ticket_id.lower() or s_lower in t.subject.lower() or s_lower in t.category.lower()
            match_cust = cust and (s_lower in cust.name.lower() or s_lower in cust.customer_id.lower())
            if not (match_tkt or match_cust):
                continue

        results.append({
            'id': t.id,
            'ticket_id': t.ticket_id,
            'customer_id': t.customer_id,
            'customer_name': cust.name if cust else 'Unknown',
            'customer_priority': cust.priority if cust else 'Normal',
            'category': t.category,
            'subcategory': t.subcategory,
            'subject': t.subject,
            'description': t.description,
            'status': t.status,
            'priority': t.priority,
            'ai_status': t.ai_status,
            'ai_confidence': t.ai_confidence,
            'success_probability': t.success_probability,
            'specialist': t.specialist,
            'risk_score': t.risk_score,
            'business_impact_score': t.business_impact_score,
            'created_at': t.created_at,
            'updated_at': t.updated_at,
            'latest_emotion': latest_msg.emotion if latest_msg else 'Neutral'
        })

    return success_response(results)

@router.get('/{ticket_id}')
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail='Ticket not found')

    cust = db.query(Customer).filter(Customer.customer_id == ticket.customer_id).first()
    conv = db.query(Conversation).filter(Conversation.conversation_id == ticket.conversation_id).first()
    messages = []
    if conv:
        msgs = db.query(Message).filter(Message.conversation_id == conv.conversation_id).order_by(Message.timestamp.asc()).all()
        messages = [
            {
                'id': m.id,
                'conversation_id': m.conversation_id,
                'sender_type': m.sender_type,
                'message_text': m.message_text,
                'timestamp': m.timestamp,
                'emotion': m.emotion,
                'sentiment_score': m.sentiment_score,
                'emotion_confidence': m.emotion_confidence,
                'urgency': m.urgency
            } for m in msgs
        ]

    ai_analysis_record = db.query(AIAnalysis).filter(AIAnalysis.ticket_id == ticket_id).first()
    ai_analysis_data = None
    if ai_analysis_record:
        handoff = None
        if ai_analysis_record.decision == 'ESCALATION_REQUIRED' or ticket.status == 'Escalated' or ticket.ai_status == 'ESCALATION_REQUIRED':
            handoff = {
                "customer_name": cust.name if cust else "Arjun Mehta",
                "customer_id": ticket.customer_id,
                "customer_plan": "Fiber 500 Mbps (₹999/mo)",
                "issue": ticket.subject or "Persistent Optical Signal Loss (LOS)",
                "outage_duration": "3 Consecutive Days",
                "hardware_telemetry": "Optical Line Attenuation -28.4 dBm (Critical: Threshold -25 dBm)",
                "emotion_label": f"{ai_analysis_record.emotion or 'Angry'} — 92%",
                "previous_ticket": "TKT-1031 (Closed Unresolved)",
                "previous_outcome": "Field ticket closed without physical splice test.",
                "tried_steps": [
                    "Tier-1 AI Copilot checked GPON ONT power levels",
                    "Customer performed router power-cycle twice (confirmed failed)",
                    "ONT red LOS blinking LED persists at customer premises"
                ],
                "relevant_knowledge": "KB-103 — Fiber Optical Signal Loss & OLT Fault Diagnostics",
                "ai_confidence_percent": "97%",
                "assigned_specialist": ticket.specialist or "Amit Sharma (Senior Technical Specialist, Tier-3 Network Operations)",
                "escalation_reason": "Persistent physical optical loss exceeding 48 hours; repeat failure after customer router restarts.",
                "recommended_next_action": "Immediate remote OLT port diagnostic reset & dispatch Tier-3 field engineer with OTDR meter."
            }

        ai_analysis_data = {
            'ticket_id': ai_analysis_record.ticket_id,
            'intent': ai_analysis_record.intent,
            'subcategory': ai_analysis_record.subcategory,
            'emotion': ai_analysis_record.emotion,
            'emotion_confidence': ai_analysis_record.emotion_confidence,
            'urgency': ai_analysis_record.urgency,
            'confidence': ai_analysis_record.confidence,
            'priority': ticket.priority,
            'decision': ai_analysis_record.decision,
            'success_probability': ai_analysis_record.success_probability,
            'missing_information': ai_analysis_record.missing_information or [],
            'suggested_question': 'Is the issue affecting all devices connected to your Wi-Fi, or only one device?' if ai_analysis_record.decision == 'NEEDS_INFORMATION' else None,
            'recommended_articles': ai_analysis_record.recommended_articles or [],
            'specialist': ticket.specialist or ai_analysis_record.specialist or 'Amit Sharma',
            'specialist_match': ai_analysis_record.specialist_match or 0.94,
            'draft_response': ai_analysis_record.draft_response,
            'reason': ai_analysis_record.reason,
            'evidence': ai_analysis_record.evidence or [],
            'next_best_actions': ai_analysis_record.next_best_actions or [],
            'quality': ai_analysis_record.quality_factors,
            'handoff_summary': handoff,
            'processing_time': ai_analysis_record.processing_time
        }

    audit_logs = db.query(AuditLog).filter(AuditLog.ticket_id == ticket_id).order_by(AuditLog.created_at.desc()).all()

    return success_response({
        'id': ticket.id,
        'ticket_id': ticket.ticket_id,
        'customer_id': ticket.customer_id,
        'customer_name': cust.name if cust else 'Unknown',
        'customer_priority': cust.priority if cust else 'Normal',
        'conversation_id': ticket.conversation_id,
        'category': ticket.category,
        'subcategory': ticket.subcategory,
        'subject': ticket.subject,
        'description': ticket.description,
        'status': ticket.status,
        'priority': ticket.priority,
        'ai_status': ticket.ai_status,
        'ai_confidence': ticket.ai_confidence,
        'success_probability': ticket.success_probability,
        'specialist': ticket.specialist,
        'specialist_match': ticket.specialist_match,
        'risk_score': ticket.risk_score,
        'business_impact_score': ticket.business_impact_score,
        'created_at': ticket.created_at,
        'updated_at': ticket.updated_at,
        'resolved_at': ticket.resolved_at,
        'messages': messages,
        'ai_analysis': ai_analysis_data,
        'audit_logs': [
            {
                'id': l.id,
                'ticket_id': l.ticket_id,
                'action': l.action,
                'actor_type': l.actor_type,
                'actor_id': l.actor_id,
                'action_data': l.action_data,
                'created_at': l.created_at
            } for l in audit_logs
        ]
    })

@router.post('/{ticket_id}/analyze')
def analyze_ticket_endpoint(ticket_id: str, db: Session = Depends(get_db)):
    try:
        result = analyze_ticket(ticket_id, db)
        return success_response(result.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/{ticket_id}/generate-response')
def generate_response_endpoint(ticket_id: str, db: Session = Depends(get_db)):
    try:
        result = analyze_ticket(ticket_id, db)
        return success_response({
            'draft_response': result.draft_response,
            'decision': result.decision,
            'cited_articles': result.recommended_articles,
            'quality': result.quality.model_dump() if result.quality else None
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post('/{ticket_id}/approve-response')
def approve_response(ticket_id: str, body: ApproveResponseRequest, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail='Ticket not found')

    # Add agent message to conversation
    new_msg = Message(
        conversation_id=ticket.conversation_id,
        sender_type='agent',
        message_text=body.response_text,
        timestamp=datetime.datetime.utcnow(),
        emotion='Helpful',
        sentiment_score=0.8,
        emotion_confidence=0.9,
        urgency='Normal'
    )
    db.add(new_msg)

    ticket.status = 'Resolved'
    ticket.resolved_at = datetime.datetime.utcnow()
    ticket.updated_at = datetime.datetime.utcnow()

    # Create Audit Log
    log = AuditLog(
        ticket_id=ticket_id,
        action='Approve & Send',
        actor_type='agent',
        actor_id=body.agent_id,
        action_data={
            'response': body.response_text,
            'cited_articles': body.cited_articles,
            'customized': body.customized,
            'ai_confidence': ticket.ai_confidence,
            'status_transition': 'Resolved'
        },
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return success_response({
        'status': 'Approved and Sent',
        'ticket_id': ticket_id,
        'new_status': ticket.status,
        'message_id': new_msg.id
    })

@router.post('/{ticket_id}/ask-customer')
def ask_customer(ticket_id: str, body: AskCustomerRequest, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail='Ticket not found')

    new_msg = Message(
        conversation_id=ticket.conversation_id,
        sender_type='agent',
        message_text=body.question_text,
        timestamp=datetime.datetime.utcnow(),
        emotion='Inquisitive',
        sentiment_score=0.4,
        emotion_confidence=0.85,
        urgency='Normal'
    )
    db.add(new_msg)

    ticket.status = 'Awaiting Customer'
    ticket.updated_at = datetime.datetime.utcnow()

    log = AuditLog(
        ticket_id=ticket_id,
        action='Ask Customer (Missing Information)',
        actor_type='agent',
        actor_id=body.agent_id,
        action_data={
            'question': body.question_text,
            'status_transition': 'Awaiting Customer'
        },
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return success_response({
        'status': 'Question Sent to Customer',
        'ticket_id': ticket_id,
        'new_status': ticket.status,
        'message_id': new_msg.id
    })

@router.post('/{ticket_id}/escalate')
def escalate_ticket(ticket_id: str, body: EscalateRequest, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail='Ticket not found')

    spec_name = body.specialist_name or 'Amit Sharma'
    ticket.status = 'Escalated'
    ticket.specialist = spec_name
    ticket.updated_at = datetime.datetime.utcnow()

    log = AuditLog(
        ticket_id=ticket_id,
        action='Escalate to Specialist',
        actor_type='agent',
        actor_id=body.agent_id,
        action_data={
            'assigned_specialist': spec_name,
            'reason': body.reason,
            'priority_callback': body.priority_callback,
            'status_transition': 'Escalated'
        },
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return success_response({
        'status': 'Ticket Escalated',
        'ticket_id': ticket_id,
        'specialist': spec_name,
        'new_status': ticket.status
    })

@router.post('/{ticket_id}/regenerate')
def regenerate_analysis(ticket_id: str, db: Session = Depends(get_db)):
    result = analyze_ticket(ticket_id, db)
    return success_response(result.model_dump())

@router.post('/{ticket_id}/customer-reply')
def customer_reply(ticket_id: str, body: Optional[CustomerReplyRequest] = None, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail='Ticket not found')

    # Find latest agent message to tailor customer reply
    latest_agent_msg = db.query(Message).filter(
        Message.conversation_id == ticket.conversation_id,
        Message.sender_type == 'agent'
    ).order_by(Message.id.desc()).first()
    agent_text = (latest_agent_msg.message_text.lower() if latest_agent_msg else "")

    # Contextual determination
    reply_content = None
    if body and body.reply_text:
        reply_content = body.reply_text
    elif ticket.ticket_id == 'TKT-1043' or ticket.category == 'Connectivity':
        if 'airplane' in agent_text or 'adapter' in agent_text or 'reconnect' in agent_text or 'dhcp' in agent_text:
            reply_content = "I toggled airplane mode and restarted my laptop's Wi-Fi adapter as you recommended, and it reconnected immediately! The internet is fully working now, thank you so much!"
            decision = 'RESOLUTION_READY'
            new_status = 'Resolved'
            new_draft = "You're very welcome, Priya! I am glad your connection has been completely restored. Have a wonderful day!"
        else:
            reply_content = "It's only affecting my laptop. My phone is working fine on the Wi-Fi."
            decision = 'RESOLUTION_READY'
            new_status = 'Resolution Ready'
            new_draft = (
                "Hello Priya, thank you for confirming! Since your phone connects without issue, "
                "your broadband fiber line and Wi-Fi router are healthy. The issue is isolated to your laptop's network adapter. "
                "Please disconnect from the Wi-Fi on your laptop, turn Airplane Mode ON for 10 seconds, then turn it OFF and reconnect. "
                "If it still doesn't resolve, restarting your laptop will refresh the DHCP IP lease. (Ref: KB-104)"
            )
    elif ticket.ticket_id == 'TKT-1042' or ticket.category == 'Billing':
        if 'roaming' in agent_text or '500' in agent_text or 'kb-102' in agent_text or 'invoice' in agent_text:
            reply_content = "Oh, that makes total sense now! I did travel to Dubai last week and used international roaming. I didn't realize it is billed in arrears on the following cycle. Thank you for clarifying that for me!"
            decision = 'RESOLUTION_READY'
            new_status = 'Resolved'
            new_draft = "You're welcome, Rahul! Glad I could verify your invoice details. Feel free to contact us if you need any further assistance."
        else:
            reply_content = "Yes, my plan is Fiber 500 Mbps and I was surprised to see ₹1,499 instead of ₹999 on my auto-debit."
            decision = 'RESOLUTION_READY'
            new_status = 'Resolution Ready'
            new_draft = "Hello Rahul, I have verified your invoice. The additional ₹500 reflects the International Roaming Pack activated on Aug 28. (Ref: KB-102)"
    elif ticket.ticket_id == 'TKT-1044' or ticket.priority == 'Critical' or ticket.ai_status == 'ESCALATION_REQUIRED':
        reply_content = "I have already restarted the router 4 times! The LOS light is still blinking red. I've had no connection for 3 days and I work from home. Standard troubleshooting does not work, please send a field technician immediately or have a senior specialist call me!"
        decision = 'ESCALATION_REQUIRED'
        new_status = 'Escalated'
        new_draft = "Hello Arjun, I understand your frustration and apologize for the extended outage. Because your line shows physical optical signal loss (LOS) after repeated router restarts, I have handed over your ticket directly to Senior Technical Specialist Amit Sharma for urgent field dispatch."
    else:
        reply_content = "Thank you for the update! I tried the steps you suggested and everything seems to be working properly now."
        decision = 'RESOLUTION_READY'
        new_status = 'Resolved'
        new_draft = "Glad to assist you! Have a great day!"

    new_msg = Message(
        conversation_id=ticket.conversation_id,
        sender_type='customer',
        message_text=reply_content,
        timestamp=datetime.datetime.utcnow(),
        emotion='Angry' if 'red' in reply_content or 'frustration' in reply_content else ('Relieved' if 'thank' in reply_content.lower() else 'Neutral'),
        sentiment_score=0.9 if 'thank' in reply_content.lower() else (-0.7 if 'not work' in reply_content.lower() else 0.2),
        emotion_confidence=0.9,
        urgency='Critical' if 'Escalated' in new_status else 'Normal'
    )
    db.add(new_msg)

    ticket.status = new_status
    ticket.ai_status = decision
    ticket.ai_confidence = 0.96
    if new_status == 'Escalated':
        ticket.specialist = 'Amit Sharma'
    ticket.updated_at = datetime.datetime.utcnow()

    # Update AI Analysis
    ai_record = db.query(AIAnalysis).filter(AIAnalysis.ticket_id == ticket_id).first()
    if ai_record:
        ai_record.decision = decision
        ai_record.confidence = 0.96
        ai_record.draft_response = new_draft
        if decision == 'ESCALATION_REQUIRED':
            ai_record.specialist = 'Amit Sharma'
            ai_record.specialist_match = 0.96

    log = AuditLog(
        ticket_id=ticket_id,
        action='Customer Clarification Received',
        actor_type='customer',
        actor_id=ticket.customer_id,
        action_data={
            'response': reply_content,
            'status_transition': new_status,
            'ai_decision': decision
        },
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return success_response({
        'status': 'Customer Response Recorded',
        'ticket_id': ticket_id,
        'new_status': ticket.status,
        'ai_decision': decision,
        'message_id': new_msg.id,
        'reply_text': reply_content,
        'new_draft': new_draft
    })

@router.post('/{ticket_id}/specialist-action')
def specialist_action(ticket_id: str, body: SpecialistActionRequest, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail='Ticket not found')

    spec_name = body.specialist_name or 'Amit Sharma'
    action_type = body.action_type

    if action_type == 'dispatch_tech':
        spec_msg = f"Specialist {spec_name}: Tier-3 Field Engineer Rajesh Varma (Van #04) has been dispatched to your address with OTDR optical testing equipment. Arrival window: 45 minutes."
        cust_reply = f"Thank you so much {spec_name}! I will be at home to give the technician access to the fiber junction terminal."
        new_status = 'In Progress'
    elif action_type == 'reset_port':
        spec_msg = f"Specialist {spec_name}: I executed a remote GPON OLT laser diagnostic and port recalibration on OLT Port 03 / Splitter #4. Line impedance normalized to -19.1 dBm."
        cust_reply = "The red LOS light just turned solid green and the internet is working again! Fantastic work, thank you!"
        new_status = 'Resolved'
    elif action_type == 'apply_credit':
        spec_msg = f"Specialist {spec_name}: I have reviewed your account and authorized a ₹500 courtesy goodwill credit to your next bill for the disruption."
        cust_reply = "Thank you so much! I really appreciate your understanding and prompt adjustment."
        new_status = 'Resolved'
    elif action_type == 'priority_callback':
        spec_msg = f"Specialist {spec_name}: Scheduled priority VIP callback for today at 5:00 PM. A Senior Engineering Manager will contact your mobile directly."
        cust_reply = "Thank you, I will keep my phone handy for the manager's call."
        new_status = 'In Progress'
    elif action_type == 'resolve':
        spec_msg = f"Specialist {spec_name}: Verification complete. All fiber nodes, line levels, and local routing tables verified 100% operational."
        cust_reply = "Everything is running smoothly now. Thank you for resolving this!"
        new_status = 'Resolved'
    else:
        raw_note = (body.notes or '').strip()
        if not raw_note:
            raw_note = "Specialist review completed. Our engineering team has prioritized your case."
        spec_msg = raw_note if (raw_note.lower().startswith("specialist") or raw_note.lower().startswith("hello") or raw_note.lower().startswith("hi")) else f"Specialist {spec_name}: {raw_note}"
        note_lower = raw_note.lower()
        if 'technician' in note_lower or 'dispatch' in note_lower or 'van' in note_lower or 'engineer' in note_lower:
            cust_reply = f"Thank you so much {spec_name}! I will be at home to give the technician access to the fiber terminal."
            new_status = 'In Progress'
        elif 'recalibration' in note_lower or 'olt' in note_lower or 'port' in note_lower or 'reset' in note_lower:
            cust_reply = "The red LOS light just turned solid green! My internet connection is working again! Fantastic work, thank you!"
            new_status = 'Resolved'
        elif 'credit' in note_lower or 'waiver' in note_lower or 'refund' in note_lower or '500' in note_lower:
            cust_reply = "Thank you so much! I really appreciate your understanding and authorizing the credit adjustment on my account."
            new_status = 'Resolved'
        elif 'callback' in note_lower or 'call' in note_lower or 'phone' in note_lower:
            cust_reply = "Thank you, I will keep my phone handy for your callback."
            new_status = 'In Progress'
        elif 'resolved' in note_lower or 'restored' in note_lower or 'operational' in note_lower:
            cust_reply = "Everything is running smoothly now. Thank you for resolving this so quickly!"
            new_status = 'Resolved'
        else:
            cust_reply = f"Thank you {spec_name}, I really appreciate you taking personal ownership of this issue."
            new_status = 'In Progress'

    msg1 = Message(
        conversation_id=ticket.conversation_id,
        sender_type='agent',
        message_text=spec_msg,
        timestamp=datetime.datetime.utcnow(),
        emotion='Helpful',
        sentiment_score=0.9,
        urgency='Normal'
    )
    db.add(msg1)

    msg2 = Message(
        conversation_id=ticket.conversation_id,
        sender_type='customer',
        message_text=cust_reply,
        timestamp=datetime.datetime.utcnow(),
        emotion='Relieved' if new_status == 'Resolved' else 'Neutral',
        sentiment_score=0.8,
        urgency='Normal'
    )
    db.add(msg2)

    ticket.status = new_status
    ticket.specialist = spec_name
    ticket.updated_at = datetime.datetime.utcnow()
    if new_status == 'Resolved':
        ticket.resolved_at = datetime.datetime.utcnow()

    log = AuditLog(
        ticket_id=ticket_id,
        action=f'Specialist Action: {action_type}',
        actor_type='specialist',
        actor_id=body.agent_id,
        action_data={
            'specialist': spec_name,
            'action_type': action_type,
            'specialist_message': spec_msg,
            'customer_reply': cust_reply,
            'new_status': new_status,
            'details': body.details
        },
        created_at=datetime.datetime.utcnow()
    )
    db.add(log)
    db.commit()

    return success_response({
        'status': 'Specialist Action Completed',
        'ticket_id': ticket_id,
        'new_status': new_status,
        'specialist_message': spec_msg,
        'customer_reply': cust_reply
    })

@router.post('/reset-demo')
def reset_demo_tickets(db: Session = Depends(get_db)):
    # TKT-1042: Billing scenario
    t1 = db.query(Ticket).filter(Ticket.ticket_id == 'TKT-1042').first()
    if t1:
        t1.status = 'Open'
        t1.ai_status = 'RESOLUTION_READY'
        db.query(Message).filter(Message.conversation_id == t1.conversation_id).delete()
        db.add(Message(
            conversation_id=t1.conversation_id,
            sender_type='customer',
            message_text='Why is my current bill ₹1,499 when my plan is only ₹999/month? Please explain the extra ₹500 charge.',
            emotion='Concerned',
            sentiment_score=-0.4,
            urgency='Normal',
            timestamp=datetime.datetime.utcnow()
        ))

    # TKT-1043: Needs info connectivity scenario
    t2 = db.query(Ticket).filter(Ticket.ticket_id == 'TKT-1043').first()
    if t2:
        t2.status = 'Open'
        t2.ai_status = 'NEEDS_INFORMATION'
        db.query(Message).filter(Message.conversation_id == t2.conversation_id).delete()
        db.add(Message(
            conversation_id=t2.conversation_id,
            sender_type='customer',
            message_text="My internet isn't working.",
            emotion='Concerned',
            sentiment_score=-0.5,
            urgency='Normal',
            timestamp=datetime.datetime.utcnow()
        ))

    # TKT-1044: Escalation required fiber outage scenario
    t3 = db.query(Ticket).filter(Ticket.ticket_id == 'TKT-1044').first()
    if t3:
        t3.status = 'Escalated'
        t3.ai_status = 'ESCALATION_REQUIRED'
        t3.specialist = 'Amit Sharma'
        db.query(Message).filter(Message.conversation_id == t3.conversation_id).delete()
        db.add(Message(
            conversation_id=t3.conversation_id,
            sender_type='customer',
            message_text="My fiber internet has been completely dead for 3 days. I already rebooted the router multiple times and ticket TKT-1031 was closed without fixing it. I need a specialist immediately!",
            emotion='Angry',
            sentiment_score=-0.8,
            urgency='Critical',
            timestamp=datetime.datetime.utcnow()
        ))

    db.commit()
    return success_response({'message': 'Demo tickets reset successfully', 'tickets': ['TKT-1042', 'TKT-1043', 'TKT-1044']})



