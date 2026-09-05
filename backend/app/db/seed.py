import datetime
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.models import (
    Customer, Account, Conversation, Message, Ticket, KnowledgeArticle,
    CustomerUsage, CustomerHealth, CustomerJourneyEvent, ProactiveAlert,
    ProactiveAction, Specialist, TeamNote, AIAnalysis, AuditLog
)
from app.db.seed_data import SPECIALISTS_DATA, PROACTIVE_ALERTS_DATA, TEAM_NOTES_DATA
from app.db.seed_articles import ARTICLES_DATA

def seed_database(db: Session = None):
    own_session = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        own_session = True

    try:
        # Clear existing tables
        db.query(AuditLog).delete()
        db.query(AIAnalysis).delete()
        db.query(TeamNote).delete()
        db.query(ProactiveAction).delete()
        db.query(ProactiveAlert).delete()
        db.query(Specialist).delete()
        db.query(CustomerJourneyEvent).delete()
        db.query(CustomerHealth).delete()
        db.query(CustomerUsage).delete()
        db.query(KnowledgeArticle).delete()
        db.query(Message).delete()
        db.query(Ticket).delete()
        db.query(Conversation).delete()
        db.query(Account).delete()
        db.query(Customer).delete()
        db.commit()

        print("1. Seeding 6 Specialists...")
        for s in SPECIALISTS_DATA:
            db.add(Specialist(**s))
        db.commit()

        print("2. Seeding 25 Knowledge Articles...")
        for a in ARTICLES_DATA:
            db.add(KnowledgeArticle(**a))
        db.commit()

        print("3. Seeding 30 Customers and Accounts...")
        first_names = ['Rahul', 'Priya', 'Arjun', 'Sunita', 'Karan', 'Ananya', 'Devendra', 'Pooja', 'Rohan', 'Sneha',
                       'Manish', 'Kavita', 'Sanjay', 'Deepa', 'Aditya', 'Meera', 'Gaurav', 'Ritu', 'Nikhil', 'Tanvi',
                       'Vikram', 'Shreya', 'Amit', 'Pallavi', 'Siddharth', 'Bhavna', 'Harsh', 'Isha', 'Varun', 'Preeti']
        last_names = ['Kumar', 'Sharma', 'Mehta', 'Patel', 'Verma', 'Roy', 'Singh', 'Hegde', 'Joshi', 'Gupta',
                      'Malhotra', 'Iyer', 'Deshmukh', 'Chopra', 'Nair', 'Menon', 'Bhatia', 'Saxena', 'Kapoor', 'Reddy',
                      'Sen', 'Mishra', 'Pandey', 'Kulkarni', 'Agarwal', 'Chatterjee', 'Dutta', 'Shah', 'Trivedi', 'Bajaj']

        plans = [
            ('Fiber 500 Mbps', 999.0, 'Broadband'),
            ('Fiber 200 Mbps', 699.0, 'Broadband'),
            ('Fiber 300 Mbps', 799.0, 'Broadband'),
            ('Fiber 100 Mbps', 499.0, 'Broadband'),
            ('Fiber 1 Gbps', 1499.0, 'Broadband'),
            ('Mobile 5G Unlimited', 599.0, 'Mobile')
        ]

        for i in range(30):
            cid = f'CUS-{1001 + i}'
            fn, ln = first_names[i], last_names[i]
            name = f'{fn} {ln}'
            email = f'{fn.lower()}.{ln.lower()}@example.com'
            phone = f'+91 9820{i:02d} {1000 + i}'
            addr = f'{101 + i * 4}, Palm Grove Heights, Andheri West, Mumbai 400053'

            if i == 0:  # Rahul Kumar
                ctype, priority, tags = 'VIP', 'VIP', ['VIP', 'Tech-Savvy', 'High Usage']
            elif i == 1:  # Priya Sharma
                ctype, priority, tags = 'Standard', 'Normal', ['Standard', 'Residential']
            elif i == 2:  # Arjun Mehta
                ctype, priority, tags = 'High', 'High', ['High Value', 'Long Tenure', 'Escalation History']
            elif i % 5 == 0:
                ctype, priority, tags = 'VIP', 'High', ['VIP', 'Priority Customer']
            else:
                ctype, priority, tags = 'Standard', 'Normal', ['Standard']

            c = Customer(
                id=i + 1, customer_id=cid, name=name, email=email, phone=phone,
                address=addr, customer_type=ctype, priority=priority, tags=tags,
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=120 - i * 2)
            )
            db.add(c)

            plan_name, price, stype = plans[i % len(plans)]
            add_charge = 500.0 if i == 0 else 0.0  # ₹500 roaming charge for Rahul Kumar
            if i == 0:
                plan_name, price = 'Fiber 500 Mbps', 999.0
            elif i == 1:
                plan_name, price = 'Fiber 200 Mbps', 699.0
            elif i == 2:
                plan_name, price = 'Fiber 300 Mbps', 799.0

            acc = Account(
                id=i + 1, customer_id=cid, account_number=f'ACC-90{8800 + i}',
                service_type=stype, plan_name=plan_name, monthly_price=price,
                additional_charges=add_charge, billing_status='Paid', service_status='Active',
                account_status='Good Standing',
                contract_start=datetime.datetime.utcnow() - datetime.timedelta(days=90),
                contract_end=datetime.datetime.utcnow() + datetime.timedelta(days=275)
            )
            db.add(acc)
        db.commit()

        print("4. Seeding Usage and Health records...")
        for i in range(20):
            cid = f'CUS-{1001 + i}'
            if i == 0:  # Rahul Kumar
                usage = CustomerUsage(
                    id=i + 1, customer_id=cid, period='Current Month', data_usage_gb=450.0,
                    mobile_usage_gb=15.0, connected_devices=4, peak_usage_start='7 PM',
                    peak_usage_end='10 PM', usage_pattern='Gaming + Streaming', hotspot_usage='Frequent'
                )
                hlth = CustomerHealth(
                    id=i + 1, customer_id=cid, risk_score=8.2, health_status='Attention',
                    risk_factors=['Repeated support interactions', 'High usage', 'Recent unresolved issue'],
                    recommended_action='Senior agent + callback'
                )
            elif i == 1:  # Priya Sharma
                usage = CustomerUsage(
                    id=i + 1, customer_id=cid, period='Current Month', data_usage_gb=185.0,
                    mobile_usage_gb=6.0, connected_devices=2, peak_usage_start='8 PM',
                    peak_usage_end='11 PM', usage_pattern='Browsing & Social Media', hotspot_usage='Low'
                )
                hlth = CustomerHealth(
                    id=i + 1, customer_id=cid, risk_score=3.4, health_status='Stable',
                    risk_factors=['New service query'], recommended_action='Standard SLA monitoring'
                )
            elif i == 2:  # Arjun Mehta
                usage = CustomerUsage(
                    id=i + 1, customer_id=cid, period='Current Month', data_usage_gb=280.0,
                    mobile_usage_gb=9.0, connected_devices=3, peak_usage_start='7 PM',
                    peak_usage_end='10 PM', usage_pattern='Streaming & Work From Home', hotspot_usage='Moderate'
                )
                hlth = CustomerHealth(
                    id=i + 1, customer_id=cid, risk_score=8.5, health_status='High Attention',
                    risk_factors=['Prolonged outage (3 days)', 'Previous unresolved ticket (TKT-1031)', 'Extreme frustration'],
                    recommended_action='Senior specialist handoff + Priority callback'
                )
            else:
                usage = CustomerUsage(
                    id=i + 1, customer_id=cid, period='Current Month', data_usage_gb=150.0 + (i * 12.0),
                    mobile_usage_gb=8.0 + (i * 0.5), connected_devices=2 + (i % 3), peak_usage_start='8 PM',
                    peak_usage_end='11 PM', usage_pattern='Streaming' if i % 2 == 0 else 'General Browsing',
                    hotspot_usage='Moderate' if i % 3 == 0 else 'Low'
                )
                hlth = CustomerHealth(
                    id=i + 1, customer_id=cid, risk_score=2.5 + (i % 4), health_status='Good' if i % 4 < 2 else 'Stable',
                    risk_factors=['Routine operations'], recommended_action='Automated courtesy check'
                )
            db.add(usage)
            db.add(hlth)
        db.commit()

        print("5. Seeding Customer Journey Events (50+ events)...")
        rahul_journey = [
            ('plan_inquiry', 'Plan inquiry', 'Customer explored high-speed fiber plans via web portal.', '30 days ago', 'info'),
            ('activation', 'Service activated', 'Fiber 500 Mbps connection installed and router provisioned successfully.', '25 days ago', 'success'),
            ('billing', 'Billing clarification - resolved', 'Explained initial installation charge split; customer confirmed satisfied.', '10 days ago', 'info'),
            ('ticket', 'Speed complaint', 'Intermittent buffering during 8 PM peak streaming reported.', '2 days ago', 'warning'),
            ('follow_up', 'Follow-up', 'Current ticket created regarding billing discrepancy on recent invoice.', 'Today', 'warning')
        ]
        for etype, title, desc, edate, sev in rahul_journey:
            db.add(CustomerJourneyEvent(customer_id='CUS-1001', event_type=etype, title=title, description=desc, event_date=edate, severity=sev))

        arjun_journey = [
            ('activation', 'Service activated', 'Fiber 300 Mbps broadband installed.', '45 days ago', 'success'),
            ('ticket', 'Ticket TKT-1031 Logged', 'Frequent internet dropouts reported.', '14 days ago', 'warning'),
            ('ticket', 'TKT-1031 Closed Without Resolution', 'Ticket automatically closed without field technician dispatch confirmation.', '12 days ago', 'danger'),
            ('ticket', 'Escalation Follow-up', 'Customer reported internet down for three consecutive days.', 'Today', 'danger')
        ]
        for etype, title, desc, edate, sev in arjun_journey:
            db.add(CustomerJourneyEvent(customer_id='CUS-1003', event_type=etype, title=title, description=desc, event_date=edate, severity=sev))

        for i in range(3, 26):
            cid = f'CUS-{1001 + i}'
            db.add(CustomerJourneyEvent(customer_id=cid, event_type='activation', title='Account Activated', description='Service activated in good standing.', event_date='60 days ago', severity='success'))
            db.add(CustomerJourneyEvent(customer_id=cid, event_type='billing', title='Auto-Debit Successful', description='Monthly subscription auto-debited.', event_date='15 days ago', severity='info'))
        db.commit()

        print("6. Seeding Proactive Alerts & Actions...")
        for a in PROACTIVE_ALERTS_DATA:
            db.add(ProactiveAlert(**a))
        db.commit()

        db.add(ProactiveAction(
            alert_id='ALT-1001', action_type='Notification',
            content="We're currently performing scheduled maintenance affecting broadband service in your area. Our network team expects service to stabilize within approximately two hours. We apologize for the inconvenience.",
            status='Prepared'
        ))
        db.add(ProactiveAction(
            alert_id='ALT-1001', action_type='Agent Briefing',
            content='Advise callers from PIN 400050 and 400052 that optical sync will fluctuate until 11:30 AM. Do not dispatch field technicians for this zone.',
            status='Approved', approved_by='Vikram Rao', approved_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=30)
        ))
        db.add(ProactiveAction(
            alert_id='ALT-1001', action_type='Compensation Review',
            content='Automate 10% bill credit for subscribers experiencing disruption exceeding 4 hours.',
            status='Prepared'
        ))
        db.commit()

        print("7. Seeding Team Notes (15 notes)...")
        for cid, author, note in TEAM_NOTES_DATA:
            db.add(TeamNote(customer_id=cid, author=author, note=note))
        db.commit()

        print("8. Seeding Tickets & Conversations (40 tickets, 80+ messages)...")
        # TKT-1031 (Previous failed ticket for Arjun Mehta)
        c_1031 = Conversation(conversation_id='CONV-1031', customer_id='CUS-1003', channel='Chat', status='Closed')
        db.add(c_1031)
        db.commit()
        db.add(Message(conversation_id='CONV-1031', sender_type='customer', message_text='My internet connection keeps dropping every 20 minutes.', timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=14), emotion='Frustrated', sentiment_score=-0.5, urgency='High'))
        db.add(Message(conversation_id='CONV-1031', sender_type='agent', message_text='We will monitor your line remotely. Ticket logged.', timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=14), emotion='Neutral', sentiment_score=0.1, urgency='Normal'))
        db.add(Ticket(
            ticket_id='TKT-1031', customer_id='CUS-1003', conversation_id='CONV-1031',
            category='Connectivity', subcategory='Connection Drops', subject='Frequent internet dropouts',
            description='Closed without resolution. Automated line test completed without on-site confirmation.',
            status='Closed without resolution', priority='High', ai_status='ESCALATION_REQUIRED', ai_confidence=0.45,
            success_probability=0.35, risk_score=7.0, business_impact_score=75.0,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=14),
            resolved_at=datetime.datetime.utcnow() - datetime.timedelta(days=12)
        ))
        db.commit()

        # TKT-1042: Rahul Kumar (Demo Scenario 1)
        c_1042 = Conversation(conversation_id='CONV-1042', customer_id='CUS-1001', channel='Chat', status='Active', priority='High')
        db.add(c_1042)
        db.commit()
        db.add(Message(conversation_id='CONV-1042', sender_type='customer', message_text='My bill is ₹1,499 but my plan is ₹999. This is wrong!', timestamp=datetime.datetime.utcnow() - datetime.timedelta(minutes=15), emotion='Frustrated', sentiment_score=-0.65, emotion_confidence=0.85, urgency='High'))
        db.add(Ticket(
            ticket_id='TKT-1042', customer_id='CUS-1001', conversation_id='CONV-1042',
            category='Billing', subcategory='Unexpected Charge', subject='Billing discrepancy on monthly invoice',
            description='Customer questioning ₹1,499 total vs ₹999 plan amount.',
            status='Open', priority='High', ai_status='RESOLUTION_READY', ai_confidence=0.94,
            success_probability=0.91, risk_score=8.2, business_impact_score=85.0,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
        ))
        db.commit()

        # TKT-1043: Priya Sharma (Demo Scenario 2)
        c_1043 = Conversation(conversation_id='CONV-1043', customer_id='CUS-1002', channel='Chat', status='Active', priority='Normal')
        db.add(c_1043)
        db.commit()
        db.add(Message(conversation_id='CONV-1043', sender_type='customer', message_text="My internet isn't working.", timestamp=datetime.datetime.utcnow() - datetime.timedelta(minutes=25), emotion='Concerned', sentiment_score=-0.35, emotion_confidence=0.80, urgency='Normal'))
        db.add(Ticket(
            ticket_id='TKT-1043', customer_id='CUS-1002', conversation_id='CONV-1043',
            category='Connectivity', subcategory='Internet Down', subject='Home broadband outage',
            description="Customer reports internet is not working; scope of devices not specified.",
            status='Open', priority='Normal', ai_status='NEEDS_INFORMATION', ai_confidence=0.72,
            success_probability=0.76, risk_score=3.4, business_impact_score=50.0,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=25)
        ))
        db.commit()

        # TKT-1044: Arjun Mehta (Demo Scenario 3)
        c_1044 = Conversation(conversation_id='CONV-1044', customer_id='CUS-1003', channel='Chat', status='Active', priority='High')
        db.add(c_1044)
        db.commit()
        db.add(Message(conversation_id='CONV-1044', sender_type='customer', message_text='My internet has been down for three days. I already restarted my router twice and contacted support yesterday.', timestamp=datetime.datetime.utcnow() - datetime.timedelta(minutes=10), emotion='Angry', sentiment_score=-0.85, emotion_confidence=0.92, urgency='Critical'))
        db.add(Ticket(
            ticket_id='TKT-1044', customer_id='CUS-1003', conversation_id='CONV-1044',
            category='Connectivity', subcategory='Internet Down', subject='Internet down for multiple days',
            description='Customer reports 3-day outage. Previous ticket TKT-1031 closed without resolution. Router reboot unsuccessful.',
            status='Open', priority='High', ai_status='ESCALATION_REQUIRED', ai_confidence=0.38,
            success_probability=0.28, specialist='Amit Sharma', specialist_match=0.94, risk_score=8.5, business_impact_score=92.0,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
        ))
        db.commit()

        # Remaining 36 tickets to reach 40 tickets total
        sample_cats = [
            ('Billing', 'Invoice', 'Requesting GST business invoice copy', 'Normal'),
            ('Connectivity', 'Slow Speed', 'Speeds dropped from 100 Mbps to 12 Mbps', 'Normal'),
            ('Mobile', 'SIM', 'Need eSIM QR code re-sent to email', 'Normal'),
            ('Connectivity', 'Wi-Fi', '5GHz Wi-Fi network not appearing on iPhone', 'Normal'),
            ('Plan', 'Upgrade', 'Inquiring about Fiber 1 Gbps installation timeline', 'High'),
            ('Roaming', 'International Roaming', 'Traveling to Dubai next Tuesday; roaming rates', 'Normal'),
            ('Payment', 'Payment', 'Bank account debited twice during bill recharge', 'High'),
            ('Mobile', '5G', '5G icon disappears when indoors', 'Normal'),
            ('Connectivity', 'Internet Down', 'Red LOS light blinking on fiber modem', 'Critical'),
            ('Billing', 'Unexpected Charge', 'Billed for late fee despite autopay', 'Normal'),
            ('Connectivity', 'Connection Drops', 'Zoom calls dropping during office hours', 'High'),
            ('Mobile', 'Data', 'Data pack exhausted unexpectedly', 'Normal')
        ]

        for idx in range(36):
            t_num = 1045 + idx
            tid = f'TKT-{t_num}'
            cid = f'CUS-{1004 + (idx % 26)}'
            conv_id = f'CONV-{t_num}'
            cat_tuple = sample_cats[idx % len(sample_cats)]
            cat, subcat, subj, prio = cat_tuple

            is_resolved = (idx % 4 == 0)
            status = 'Resolved' if is_resolved else ('In Progress' if idx % 3 == 0 else 'Open')
            emot = 'Angry' if prio == 'Critical' else ('Frustrated' if cat == 'Billing' else ('Happy' if is_resolved else 'Neutral'))

            conv = Conversation(conversation_id=conv_id, customer_id=cid, channel='Chat' if idx % 2 == 0 else 'Email', status='Closed' if is_resolved else 'Active', priority=prio)
            db.add(conv)
            db.commit()

            # Message 1
            db.add(Message(
                conversation_id=conv_id, sender_type='customer',
                message_text=f'Hello support, {subj}. Could you please check this?',
                timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=1 + idx),
                emotion=emot, sentiment_score=-0.6 if emot in ['Angry', 'Frustrated'] else 0.1,
                emotion_confidence=0.85, urgency='High' if prio in ['High', 'Critical'] else 'Normal'
            ))

            # Message 2 (agent response for resolved/in progress)
            if is_resolved or idx % 3 == 0:
                db.add(Message(
                    conversation_id=conv_id, sender_type='agent',
                    message_text='Hello, we have checked your line records. Telemetry is active and operating normally.',
                    timestamp=datetime.datetime.utcnow() - datetime.timedelta(hours=idx, minutes=30),
                    emotion='Helpful', sentiment_score=0.8, emotion_confidence=0.9
                ))

            ai_st = 'ESCALATION_REQUIRED' if prio == 'Critical' else ('RESOLUTION_READY' if is_resolved or idx % 2 == 0 else 'NEEDS_INFORMATION')
            conf = 0.42 if ai_st == 'ESCALATION_REQUIRED' else (0.93 if ai_st == 'RESOLUTION_READY' else 0.74)
            succ = 0.32 if ai_st == 'ESCALATION_REQUIRED' else (0.91 if ai_st == 'RESOLUTION_READY' else 0.78)

            db.add(Ticket(
                ticket_id=tid, customer_id=cid, conversation_id=conv_id,
                category=cat, subcategory=subcat, subject=subj,
                description=f'Customer query: {subj}', status=status, priority=prio,
                ai_status=ai_st, ai_confidence=conf, success_probability=succ,
                specialist='Amit Sharma' if ai_st == 'ESCALATION_REQUIRED' else None,
                specialist_match=0.94 if ai_st == 'ESCALATION_REQUIRED' else 0.0,
                risk_score=7.5 if emot == 'Angry' else 3.2,
                business_impact_score=80.0 if prio in ['High', 'Critical'] else 50.0,
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1 + idx),
                updated_at=datetime.datetime.utcnow()
            ))
        db.commit()

        print("9. Pre-analyzing Demo Tickets (TKT-1042, TKT-1043, TKT-1044)...")
        from app.services.ai_service import analyze_ticket
        analyze_ticket('TKT-1042', db)
        analyze_ticket('TKT-1043', db)
        analyze_ticket('TKT-1044', db)

        print("Database seed complete successfully!")

    finally:
        if own_session:
            db.close()

if __name__ == '__main__':
    seed_database()
