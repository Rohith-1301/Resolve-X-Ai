from typing import List, Dict, Any

def get_usage_opportunities() -> List[Dict[str, Any]]:
    '''
    Returns predictive customer success upgrade candidates (45 customers approaching data limits).
    Highlighted by Rahul Kumar with 73% demo upgrade likelihood.
    '''
    return [
        {
            'customer_id': 'CUS-1001',
            'customer_name': 'Rahul Kumar',
            'plan_name': 'Fiber 500 Mbps',
            'usage_gb': 450.0,
            'allowance_gb': 500.0,
            'percent_used': 90.0,
            'recommended_plan': 'Fiber 1 Gbps (Unlimited)',
            'opportunity_score': 0.73,  # 73% demo probability
            'trigger': 'Consistently high usage (450 GB/month with 4 connected gaming/streaming devices)',
            'suggested_action': 'Prepare personalized offer with zero installation fee',
            'best_outreach': 'After next billing cycle'
        },
        {
            'customer_id': 'CUS-1008',
            'customer_name': 'Pooja Hegde',
            'plan_name': 'Fiber 100 Mbps',
            'usage_gb': 285.0,
            'allowance_gb': 300.0,
            'percent_used': 95.0,
            'recommended_plan': 'Fiber 300 Mbps',
            'opportunity_score': 0.81,
            'trigger': 'Approaching data threshold 5 days before billing cycle reset',
            'suggested_action': 'Offer mid-tier speed boost',
            'best_outreach': 'Immediate portal prompt'
        },
        {
            'customer_id': 'CUS-1012',
            'customer_name': 'Manish Malhotra',
            'plan_name': 'Mobile Unlimited 25GB',
            'usage_gb': 23.8,
            'allowance_gb': 25.0,
            'percent_used': 95.2,
            'recommended_plan': '5G Unlimited Data Max',
            'opportunity_score': 0.68,
            'trigger': 'High hotspot usage pattern detected on mobile line',
            'suggested_action': 'Offer unlimited 5G add-on pack',
            'best_outreach': 'Next account login'
        }
    ]

def get_predictive_insights() -> Dict[str, Any]:
    '''
    Returns trending topics and capacity planning telemetry.
    '''
    return {
        'trending_issues': [
            {
                'topic': '5G Setup & Device Handshake',
                'change_percent': 25.0,
                'direction': 'up',
                'affected_count': 142
            },
            {
                'topic': 'Billing Questions & Surcharges',
                'change_percent': 15.0,
                'direction': 'up',
                'affected_count': 98
            },
            {
                'topic': 'Plan Downgrade Inquiries',
                'change_percent': -8.0,
                'direction': 'down',
                'affected_count': 32
            },
            {
                'topic': 'Router Reboot Diagnostics',
                'change_percent': -4.5,
                'direction': 'down',
                'affected_count': 54
            }
        ],
        'capacity_plan': {
            'peak_periods': ['2:00 PM – 5:00 PM', '7:00 PM – 10:00 PM'],
            'current_agents': 10,
            'recommended_agents': 12,
            'reason': 'High expected support volume driven by evening peak usage and Mumbai area maintenance tickets.',
            'disclaimer': 'Demo capacity estimate'
        }
    }
