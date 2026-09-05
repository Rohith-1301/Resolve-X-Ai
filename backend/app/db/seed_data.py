# Seed data definitions for ResolveAI
SPECIALISTS_DATA = [
    {'id': 1, 'name': 'Amit Sharma', 'title': 'Senior Technical Specialist', 'department': 'Broadband & Infrastructure', 'expertise': 'Broadband / Connectivity / Prolonged Outages', 'active_tickets': 4, 'max_capacity': 10, 'status': 'Available'},
    {'id': 2, 'name': 'Priya Nair', 'title': 'Billing Specialist', 'department': 'Billing & Finance', 'expertise': 'Billing / Payments / Surcharges & Dispute Resolution', 'active_tickets': 3, 'max_capacity': 10, 'status': 'Available'},
    {'id': 3, 'name': 'Neha Kapoor', 'title': 'Mobile Specialist', 'department': 'Mobile Operations', 'expertise': 'SIM / Mobile / 5G / Roaming Diagnostics', 'active_tickets': 2, 'max_capacity': 10, 'status': 'Available'},
    {'id': 4, 'name': 'Vikram Rao', 'title': 'Network Specialist', 'department': 'Core Networks', 'expertise': 'Network / Outages / Distribution Node Engineering', 'active_tickets': 5, 'max_capacity': 10, 'status': 'Busy'},
    {'id': 5, 'name': 'Sarah Thomas', 'title': 'Customer Success Specialist', 'department': 'Retention Ops', 'expertise': 'Retention / Customer Health / VIP Escalation Protocols', 'active_tickets': 2, 'max_capacity': 8, 'status': 'Available'},
    {'id': 6, 'name': 'Arjun Patel', 'title': 'General Support Specialist', 'department': 'Customer Care', 'expertise': 'General issues / Account Queries / First Contact Resolution', 'active_tickets': 3, 'max_capacity': 12, 'status': 'Available'}
]

PROACTIVE_ALERTS_DATA = [
    {
        'alert_id': 'ALT-1001', 'alert_type': 'Maintenance', 'title': 'Mumbai Tower 3 Maintenance',
        'description': 'Scheduled optical line distribution replacement and antenna tilt calibration impacting broadband nodes in Bandra West and Khar.',
        'location': 'Mumbai Central & Bandra West', 'affected_customers': 234, 'severity': 'High', 'status': 'Active',
        'estimated_resolution': '2 hours'
    },
    {
        'alert_id': 'ALT-1002', 'alert_type': 'Outage', 'title': 'Andheri East Substation Cable Cut',
        'description': 'Third-party metro excavation damaged underground trunk fiber line. Emergency field splice team deployed.',
        'location': 'Andheri East, Mumbai', 'affected_customers': 118, 'severity': 'Critical', 'status': 'Active',
        'estimated_resolution': '4 hours'
    },
    {
        'alert_id': 'ALT-1003', 'alert_type': 'Network', 'title': 'Bangalore Indiranagar 5G Optimization',
        'description': 'Cellular node software upgrade to enable 5G Standalone carrier aggregation.',
        'location': 'Indiranagar, Bangalore', 'affected_customers': 64, 'severity': 'Medium', 'status': 'Monitoring',
        'estimated_resolution': '1 hour'
    },
    {
        'alert_id': 'ALT-1004', 'alert_type': 'Billing', 'title': 'Payment Gateway Latency HDFC/ICICI',
        'description': 'Intermittent bank API timeouts on net banking and debit cards. Transactions queued for auto-retry.',
        'location': 'National Gateway', 'affected_customers': 320, 'severity': 'Medium', 'status': 'Monitoring',
        'estimated_resolution': '30 minutes'
    },
    {
        'alert_id': 'ALT-1005', 'alert_type': 'Maintenance', 'title': 'Delhi NCR Core Router Firmware Patch',
        'description': 'Routine quarterly security update on secondary edge distribution routers.',
        'location': 'Delhi NCR', 'affected_customers': 85, 'severity': 'Low', 'status': 'Resolved',
        'estimated_resolution': 'Completed'
    }
]

TEAM_NOTES_DATA = [
    ('CUS-1001', 'Arjun Patel', 'Prefers technical explanations. High-value customer with smart home setup.'),
    ('CUS-1001', 'Priya Nair', 'Previous billing clarification resolved smoothly. Appreciates itemized transparency.'),
    ('CUS-1001', 'Sarah Thomas', 'High usage pattern; recommended for Fiber 1 Gbps tier at upcoming cycle.'),
    ('CUS-1003', 'Amit Sharma', 'Customer experienced repeated line dropouts. Check optical splice box at pillar 4.'),
    ('CUS-1003', 'Vikram Rao', 'Previous ticket TKT-1031 closed prematurely due to CRM automation glitch. Needs priority care.'),
    ('CUS-1002', 'Arjun Patel', 'First-time fiber user; assist with Wi-Fi network naming and dual-band separation.'),
    ('CUS-1004', 'Sarah Thomas', 'Customer sensitive to prolonged outages; flag for area maintenance alerts.'),
    ('CUS-1005', 'Neha Kapoor', 'Requested eSIM QR delivery via registered email.'),
    ('CUS-1006', 'Priya Nair', 'Requested corporate invoice GSTIN header inclusion.'),
    ('CUS-1007', 'Amit Sharma', 'Router relocated to central living room for optimized 5GHz signal.'),
    ('CUS-1008', 'Sarah Thomas', 'Data threshold approached 3 months consecutively; great upgrade candidate.'),
    ('CUS-1009', 'Arjun Patel', 'Inquired about international roaming options for Europe trip next week.'),
    ('CUS-1010', 'Vikram Rao', 'Line attenuation verified at -18 dBm (excellent signal strength).'),
    ('CUS-1011', 'Neha Kapoor', 'Advised on enabling VoLTE on Samsung handset.'),
    ('CUS-1012', 'Priya Nair', 'Updated autopay credit card details upon customer request.')
]
