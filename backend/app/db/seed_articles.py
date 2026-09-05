# Knowledge articles for ResolveAI
ARTICLES_DATA = [
    {
        'article_id': 'KB-101', 'title': 'Broadband Troubleshooting', 'category': 'Connectivity', 'subcategory': 'Internet Down',
        'content': 'Comprehensive step-by-step diagnostic guide for fiber and broadband outages. 1. Inspect optical signal indicator (green steady = normal, flashing red = optical signal loss). 2. Power cycle the Optical Network Terminal (ONT) for 30 seconds. 3. Re-seat Ethernet cable connecting ONT GE1 port to router WAN port. 4. Verify line impedance and distribution point synchronization via diagnostic portal.',
        'keywords': ['broadband', 'troubleshooting', 'fiber', 'down', 'ont', 'router', 'no internet', 'red light'],
        'tags': ['Connectivity', 'Core', 'Hardware'], 'usage_count': 214, 'success_rate': 0.88, 'avg_resolution_time': 3.1, 'effectiveness_score': 0.91
    },
    {
        'article_id': 'KB-102', 'title': 'Understanding Additional Charges', 'category': 'Billing', 'subcategory': 'Unexpected Charge',
        'content': 'Guideline on interpreting monthly invoice surcharges beyond base subscription. Recurring plan charges cover bundled allowances. Additional charges stem from: 1. International roaming data usage beyond daily caps. 2. Premium on-demand OTT pay-per-view rentals. 3. Unreturned legacy router hardware depreciation. Customers can request an itemized billing ledger or submit a waiver request for first-time accidental roaming triggers.',
        'keywords': ['additional charges', 'bill', 'surcharge', 'unexpected', 'roaming', 'invoice', '₹1,499', '1499', '₹500'],
        'tags': ['Billing', 'Policy', 'High Impact'], 'usage_count': 182, 'success_rate': 0.94, 'avg_resolution_time': 2.4, 'effectiveness_score': 0.96
    },
    {
        'article_id': 'KB-103', 'title': 'Billing Dispute Process', 'category': 'Billing', 'subcategory': 'Dispute',
        'content': 'Standard protocol for investigating and resolving billing discrepancies. Support agents are authorized to issue temporary dispute holds up to ₹1,000 pending audit. Escalations exceeding ₹1,000 must route to Priya Nair (Billing Specialist) for secondary review.',
        'keywords': ['billing dispute', 'dispute', 'overcharged', 'audit', 'credit hold'],
        'tags': ['Billing', 'Finance'], 'usage_count': 98, 'success_rate': 0.89, 'avg_resolution_time': 4.2, 'effectiveness_score': 0.90
    },
    {
        'article_id': 'KB-104', 'title': 'Payment Failed Troubleshooting', 'category': 'Payment', 'subcategory': 'Transaction Failure',
        'content': 'Procedures for failed autopay, UPI, and debit card transactions. Provide a 48-hour service grace period. Ensure customer bank gateway timeout does not double-bill.',
        'keywords': ['payment failed', 'transaction', 'declined', 'autopay', 'grace period'],
        'tags': ['Payment', 'Troubleshooting'], 'usage_count': 74, 'success_rate': 0.93, 'avg_resolution_time': 2.1, 'effectiveness_score': 0.94
    },
    {
        'article_id': 'KB-105', 'title': 'Plan Upgrade Options', 'category': 'Plan', 'subcategory': 'Upgrade',
        'content': 'Guidelines for broadband plan upgrades. Upgrades to Fiber 1 Gbps take effect immediately with zero downtime. Prorated billing applies for the remaining calendar days.',
        'keywords': ['plan upgrade', 'upgrade', 'fiber 1 gbps', 'speed boost', 'pricing'],
        'tags': ['Plan', 'Growth'], 'usage_count': 120, 'success_rate': 0.96, 'avg_resolution_time': 2.0, 'effectiveness_score': 0.95
    },
    {
        'article_id': 'KB-106', 'title': 'Plan Downgrade Policy', 'category': 'Plan', 'subcategory': 'Downgrade',
        'content': 'Rules for plan downgrades. Downgrades take effect at the start of the next billing cycle. Early termination fees waived if requested after 6 months of continuous active tenure.',
        'keywords': ['plan downgrade', 'downgrade', 'lower plan', 'contract'],
        'tags': ['Plan', 'Retention'], 'usage_count': 45, 'success_rate': 0.82, 'avg_resolution_time': 3.5, 'effectiveness_score': 0.86
    },
    {
        'article_id': 'KB-107', 'title': 'International Roaming Charges', 'category': 'Roaming', 'subcategory': 'International',
        'content': 'Standard tariff schedules for international roaming. Data packs must be pre-activated to avoid standard pay-as-you-go rates (₹500 per 100MB in designated zones).',
        'keywords': ['international roaming', 'roaming', 'abroad', 'overseas data', '₹500'],
        'tags': ['Roaming', 'Tariff'], 'usage_count': 110, 'success_rate': 0.89, 'avg_resolution_time': 2.9, 'effectiveness_score': 0.91
    },
    {
        'article_id': 'KB-108', 'title': 'SIM Replacement', 'category': 'Mobile', 'subcategory': 'SIM',
        'content': 'Procedures for lost, damaged, or upgraded physical SIM and eSIM swap. Verification via Aadhaar/ID and OTP mandatory. Activation timeframe is 2 to 4 hours post-verification.',
        'keywords': ['sim replacement', 'sim swap', 'esim', 'lost sim', 'damaged sim'],
        'tags': ['Mobile', 'Security'], 'usage_count': 88, 'success_rate': 0.91, 'avg_resolution_time': 3.0, 'effectiveness_score': 0.92
    },
    {
        'article_id': 'KB-109', 'title': 'Mobile Data Troubleshooting', 'category': 'Mobile', 'subcategory': 'Data',
        'content': 'Troubleshooting mobile cellular data. Verify APN settings (APN: internet), toggle mobile data and Airplane mode, check active data quota balance.',
        'keywords': ['mobile data', 'slow mobile', 'apn settings', '4g', '5g data'],
        'tags': ['Mobile', 'Diagnostic'], 'usage_count': 92, 'success_rate': 0.87, 'avg_resolution_time': 2.6, 'effectiveness_score': 0.89
    },
    {
        'article_id': 'KB-110', 'title': '5G Setup Guide', 'category': 'Mobile', 'subcategory': '5G',
        'content': 'Detailed instructions for enabling 5G Standalone (SA) and Non-Standalone (NSA) modes on compatible iOS and Android devices. Requires latest OS patch and 5G SIM profile.',
        'keywords': ['5g setup', '5g network', 'standalone', 'sa', 'nsa', 'enable 5g'],
        'tags': ['Mobile', '5G'], 'usage_count': 135, 'success_rate': 0.92, 'avg_resolution_time': 2.8, 'effectiveness_score': 0.93
    },
    {
        'article_id': 'KB-111', 'title': 'Wi-Fi Device Troubleshooting', 'category': 'Connectivity', 'subcategory': 'Wi-Fi',
        'content': 'Resolving single-device vs multi-device Wi-Fi drops. If only one laptop or phone drops, reconfigure device IP from static to DHCP and forget/reconnect network. If all devices drop, reboot router.',
        'keywords': ['wifi device', 'single device', 'all devices', 'wifi disconnect', 'dhcp'],
        'tags': ['Connectivity', 'Wi-Fi'], 'usage_count': 165, 'success_rate': 0.90, 'avg_resolution_time': 2.7, 'effectiveness_score': 0.92
    },
    {
        'article_id': 'KB-112', 'title': 'Router Restart Procedure', 'category': 'Connectivity', 'subcategory': 'Hardware',
        'content': 'Standard safe power cycle instructions. 1. Unplug power adapter from wall outlet. 2. Wait 30 seconds for capacitors to discharge. 3. Reconnect power and allow 3 minutes for optical handshake.',
        'keywords': ['router restart', 'power cycle', 'reboot router', 'restarted router twice'],
        'tags': ['Connectivity', 'Hardware'], 'usage_count': 190, 'success_rate': 0.85, 'avg_resolution_time': 2.2, 'effectiveness_score': 0.88
    },
    {
        'article_id': 'KB-113', 'title': 'Service Outage Communication', 'category': 'Network', 'subcategory': 'Outage',
        'content': 'Guidelines for handling customer queries during major distribution outages. Verify local tower status, share estimated time of restoration (ETR), and offer ticket tracking links.',
        'keywords': ['service outage', 'area outage', 'tower maintenance', 'etr', 'mumbai tower'],
        'tags': ['Network', 'Emergency'], 'usage_count': 140, 'success_rate': 0.86, 'avg_resolution_time': 3.8, 'effectiveness_score': 0.89
    },
    {
        'article_id': 'KB-114', 'title': 'Network Maintenance FAQ', 'category': 'Network', 'subcategory': 'Maintenance',
        'content': 'Explaining scheduled nocturnal network upgrades and distribution fiber re-splicing. Maintenance windows typically run 1:00 AM - 5:00 AM to minimize subscriber disruption.',
        'keywords': ['network maintenance', 'maintenance faq', 'scheduled maintenance', 'tower 3'],
        'tags': ['Network', 'Maintenance'], 'usage_count': 67, 'success_rate': 0.92, 'avg_resolution_time': 2.0, 'effectiveness_score': 0.93
    },
    {
        'article_id': 'KB-115', 'title': 'Customer Compensation Review', 'category': 'Billing', 'subcategory': 'Compensation',
        'content': 'Credit compensation matrix for extended unscheduled downtime. Downtime > 24 hours qualifies for 10% monthly bill credit; downtime > 48 hours qualifies for 25% bill credit upon supervisor sign-off.',
        'keywords': ['customer compensation', 'service credit', 'refund', 'downtime credit', 'outage compensation'],
        'tags': ['Billing', 'Retention'], 'usage_count': 52, 'success_rate': 0.88, 'avg_resolution_time': 4.5, 'effectiveness_score': 0.90
    },
    {
        'article_id': 'KB-116', 'title': 'Account Verification', 'category': 'Account', 'subcategory': 'Verification',
        'content': 'Mandatory customer identification steps. Agents must verify customer name, registered mobile number, and last 4 digits of account number before disclosing billing records.',
        'keywords': ['account verification', 'verify customer', 'identity', 'otp', 'security'],
        'tags': ['Account', 'Security'], 'usage_count': 230, 'success_rate': 0.98, 'avg_resolution_time': 1.2, 'effectiveness_score': 0.97
    },
    {
        'article_id': 'KB-117', 'title': 'Contract Information', 'category': 'Account', 'subcategory': 'Contract',
        'content': 'Reviewing annual fiber contracts, lock-in periods, and security deposit terms. Standard residential contracts feature 12-month tenure with free dual-band Wi-Fi router inclusion.',
        'keywords': ['contract', 'tenure', 'lock-in', 'agreement', 'terms'],
        'tags': ['Account', 'Legal'], 'usage_count': 41, 'success_rate': 0.94, 'avg_resolution_time': 2.5, 'effectiveness_score': 0.92
    },
    {
        'article_id': 'KB-118', 'title': 'Broadband Speed Troubleshooting', 'category': 'Connectivity', 'subcategory': 'Slow Speed',
        'content': 'Step-by-step resolution for slow internet speeds. Perform speed test over 5GHz Wi-Fi or Cat6 Ethernet cable within 3 meters of router. Ensure background torrents or downloads are paused.',
        'keywords': ['broadband speed', 'slow internet', 'buffering', 'speed test', 'low mbps'],
        'tags': ['Connectivity', 'Diagnostic'], 'usage_count': 178, 'success_rate': 0.87, 'avg_resolution_time': 3.4, 'effectiveness_score': 0.89
    },
    {
        'article_id': 'KB-119', 'title': 'Connection Drop Troubleshooting', 'category': 'Connectivity', 'subcategory': 'Connection Drops',
        'content': 'Investigating frequent Wi-Fi disconnects. Check Wi-Fi channel crowding, relocate router away from microwaves/thick concrete walls, and update network adapter drivers.',
        'keywords': ['connection drops', 'disconnecting', 'intermittent', 'drops every hour'],
        'tags': ['Connectivity', 'Wi-Fi'], 'usage_count': 134, 'success_rate': 0.84, 'avg_resolution_time': 3.6, 'effectiveness_score': 0.87
    },
    {
        'article_id': 'KB-120', 'title': 'Escalation Guidelines', 'category': 'General', 'subcategory': 'Escalation',
        'content': 'When and how to escalate customer cases to specialized tier-2 teams. Mandated when customer has experienced unresolved outage > 48 hours, multiple failed contacts, or high churn risk.',
        'keywords': ['escalation guidelines', 'tier 2', 'handoff', 'specialist escalation', 'supervisor callback'],
        'tags': ['Operations', 'Protocol'], 'usage_count': 115, 'success_rate': 0.95, 'avg_resolution_time': 1.8, 'effectiveness_score': 0.96
    },
    {
        'article_id': 'KB-121', 'title': 'Fiber Optical Cable Care', 'category': 'Connectivity', 'subcategory': 'Hardware',
        'content': 'Safety and handling of yellow fiber patch cords. Never bend the fiber cable past a 30mm radius to prevent internal glass core micro-fractures.',
        'keywords': ['fiber cable', 'patch cord', 'optical fiber', 'yellow wire', 'bend radius'],
        'tags': ['Connectivity', 'Hardware'], 'usage_count': 32, 'success_rate': 0.92, 'avg_resolution_time': 2.0, 'effectiveness_score': 0.91
    },
    {
        'article_id': 'KB-122', 'title': 'Static IP Configuration', 'category': 'Connectivity', 'subcategory': 'Advanced',
        'content': 'Setup manual for commercial and power users requiring static IPv4 addresses for home servers, CCTV security systems, and remote VPN gateways.',
        'keywords': ['static ip', 'ipv4', 'cctv', 'vpn', 'port forwarding'],
        'tags': ['Connectivity', 'Advanced'], 'usage_count': 48, 'success_rate': 0.91, 'avg_resolution_time': 4.1, 'effectiveness_score': 0.93
    },
    {
        'article_id': 'KB-123', 'title': 'Dual Band Wi-Fi Optimization', 'category': 'Connectivity', 'subcategory': 'Wi-Fi',
        'content': 'Configuring 2.4 GHz (better range through walls) vs 5.0 GHz (faster throughput up to 1Gbps) bands for optimal multi-room coverage.',
        'keywords': ['dual band', '2.4 ghz', '5 ghz', 'channel optimization', 'ssid separation'],
        'tags': ['Connectivity', 'Wi-Fi'], 'usage_count': 82, 'success_rate': 0.93, 'avg_resolution_time': 2.5, 'effectiveness_score': 0.94
    },
    {
        'article_id': 'KB-124', 'title': 'eSIM Profile Installation', 'category': 'Mobile', 'subcategory': 'SIM',
        'content': 'Step-by-step QR code scan and carrier profile activation for Apple iPhone, Samsung Galaxy, and Google Pixel devices.',
        'keywords': ['esim', 'qr code', 'carrier profile', 'apple', 'samsung', 'pixel'],
        'tags': ['Mobile', 'eSIM'], 'usage_count': 79, 'success_rate': 0.95, 'avg_resolution_time': 2.2, 'effectiveness_score': 0.96
    },
    {
        'article_id': 'KB-125', 'title': 'International Calling ISD Packs', 'category': 'Roaming', 'subcategory': 'ISD',
        'content': 'Directory of country-specific ISD dial codes, special bundle packs for USA, UK, UAE, and Singapore, and per-minute talktime rates.',
        'keywords': ['isd packs', 'international calling', 'talktime', 'country code'],
        'tags': ['Roaming', 'Voice'], 'usage_count': 38, 'success_rate': 0.90, 'avg_resolution_time': 2.1, 'effectiveness_score': 0.92
    }
]
