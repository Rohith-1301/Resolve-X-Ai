import re
from typing import Tuple

INTENT_RULES = [
    {
        'category': 'Billing',
        'subcategories': {
            'Unexpected Charge': ['higher', 'charge', 'wrong', 'extra', 'unexpected', '₹1,499', '1499', 'more than', 'discrepancy'],
            'Refund Request': ['refund', 'money back', 'reimburse', 'compensate', 'credited back'],
            'Invoice': ['invoice', 'bill copy', 'breakdown', 'statement', 'receipt'],
            'Payment': ['payment failed', 'declined', 'transaction failed', 'autopay', 'paid twice']
        },
        'keywords': ['bill', 'charged', 'charge', 'pricing', 'cost', 'fee', 'payment', 'paid', 'invoice', '₹']
    },
    {
        'category': 'Connectivity',
        'subcategories': {
            'Internet Down': ['down', 'not working', 'no internet', 'disconnected', 'red light', 'outage', 'unavailable', 'three days'],
            'Slow Speed': ['slow', 'speed', 'buffering', 'lag', 'low mbps', 'bandwidth'],
            'Connection Drops': ['drops', 'disconnecting', 'intermittent', 'keeps dropping', 'unstable'],
            'Wi-Fi': ['wifi', 'wi-fi', 'router', 'range', 'signal', 'ssid', 'password']
        },
        'keywords': ['internet', 'wifi', 'wi-fi', 'broadband', 'router', 'fiber', 'connection', 'optical', 'dsl', 'down']
    },
    {
        'category': 'Mobile',
        'subcategories': {
            '5G': ['5g', '5g network', '5g setup', 'stand-alone', 'nr'],
            'SIM': ['sim', 'esim', 'activate sim', 'no service', 'puk', 'swap'],
            'Data': ['mobile data', '4g', 'data pack', 'cellular', 'roaming data']
        },
        'keywords': ['sim', 'mobile', '5g', 'cellular', 'roaming', 'esim', 'call', 'sms']
    },
    {
        'category': 'Plan',
        'subcategories': {
            'Upgrade': ['upgrade', 'higher plan', 'faster speed', 'unlimited', 'boost'],
            'Downgrade': ['downgrade', 'cheaper', 'reduce plan', 'lower cost'],
            'Pricing': ['plan details', 'pricing', 'options', 'tariff']
        },
        'keywords': ['plan', 'upgrade', 'downgrade', 'package', 'subscription']
    },
    {
        'category': 'Roaming',
        'subcategories': {
            'International Roaming': ['roaming', 'international', 'abroad', 'overseas', 'travel']
        },
        'keywords': ['roaming', 'international', 'travel', 'abroad']
    }
]

def detect_intent(text: str) -> Tuple[str, str, float]:
    '''
    Detects category, subcategory and confidence based on message text.
    Returns (category, subcategory, confidence)
    '''
    lower_text = text.lower()
    best_cat = 'General Inquiry'
    best_subcat = 'General Support'
    highest_score = 0
    confidence = 0.70

    for rule in INTENT_RULES:
        category = rule['category']
        score = 0
        for kw in rule['keywords']:
            if kw in lower_text:
                score += 2
        
        matched_subcat = None
        for subcat, sub_keywords in rule['subcategories'].items():
            for skw in sub_keywords:
                if skw in lower_text:
                    score += 3
                    matched_subcat = subcat
                    break

        if score > highest_score:
            highest_score = score
            best_cat = category
            best_subcat = matched_subcat or list(rule['subcategories'].keys())[0]

    if highest_score >= 5:
        confidence = 0.94
    elif highest_score >= 3:
        confidence = 0.88
    elif highest_score > 0:
        confidence = 0.78
    else:
        best_cat = 'Service Request'
        best_subcat = 'General Inquiry'
        confidence = 0.65

    return best_cat, best_subcat, confidence
