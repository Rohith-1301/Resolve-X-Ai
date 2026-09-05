import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import KnowledgeArticle
from app.schemas.response import success_response, error_response
from app.schemas.knowledge import KnowledgeSearchRequest, CreateDraftArticleRequest
from app.services.rag_service import retrieve_knowledge

router = APIRouter(prefix='/api/knowledge', tags=['knowledge'])

@router.get('')
def get_articles(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(KnowledgeArticle)
    if category and category != 'All':
        query = query.filter(KnowledgeArticle.category == category)
    articles = query.order_by(KnowledgeArticle.usage_count.desc()).all()
    return success_response([
        {
            'id': a.id,
            'article_id': a.article_id,
            'title': a.title,
            'category': a.category,
            'subcategory': a.subcategory,
            'content': a.content,
            'keywords': a.keywords or [],
            'tags': a.tags or [],
            'usage_count': a.usage_count,
            'success_rate': a.success_rate,
            'avg_resolution_time': a.avg_resolution_time,
            'effectiveness_score': a.effectiveness_score,
            'last_updated': a.last_updated,
            'review_date': a.review_date
        } for a in articles
    ])

@router.get('/gaps')
def get_knowledge_gaps():
    '''
    Identifies high-priority support topics lacking verified resolution guides.
    '''
    return success_response([
        {
            'id': 'GAP-01',
            'topic': '5G Standalone Device Handshake Failures',
            'affected_ticket_count': 38,
            'gap_severity': 'High',
            'recommended_article': 'KB-126: 5G SA Handshake & Network Mode Override',
            'category': 'Mobile'
        },
        {
            'id': 'GAP-02',
            'topic': 'International In-Flight & Maritime Roaming',
            'affected_ticket_count': 24,
            'gap_severity': 'High',
            'recommended_article': 'KB-127: Maritime and In-flight Data Surcharges',
            'category': 'Roaming'
        },
        {
            'id': 'GAP-03',
            'topic': 'Mesh Wi-Fi Backhaul Channel Interference',
            'affected_ticket_count': 19,
            'gap_severity': 'Medium',
            'recommended_article': 'KB-128: Wi-Fi 6 Mesh Dynamic Frequency Selection (DFS)',
            'category': 'Connectivity'
        },
        {
            'id': 'GAP-04',
            'topic': 'Multi-Gig Optical Network Terminal (ONT) Bridge Mode',
            'affected_ticket_count': 14,
            'gap_severity': 'Medium',
            'recommended_article': 'KB-129: ONT Bridge Mode Setup & Static IP Assignment',
            'category': 'Connectivity'
        }
    ])

@router.get('/analytics')
def get_knowledge_analytics(db: Session = Depends(get_db)):
    articles = db.query(KnowledgeArticle).all()
    total_articles = len(articles)
    total_usage = sum(a.usage_count for a in articles)
    avg_eff = sum(a.effectiveness_score for a in articles) / total_articles if total_articles else 0.91

    top = sorted(articles, key=lambda x: x.usage_count, reverse=True)[:5]

    return success_response({
        'total_articles': total_articles,
        'used_today': 87,
        'average_effectiveness': round(avg_eff, 2),
        'knowledge_gaps_count': 4,
        'top_articles': [
            {
                'article_id': a.article_id,
                'title': a.title,
                'category': a.category,
                'usage_count': a.usage_count,
                'success_rate': a.success_rate,
                'avg_resolution_time': a.avg_resolution_time,
                'effectiveness_score': a.effectiveness_score
            } for a in top
        ]
    })

@router.get('/{article_id}')
def get_article(article_id: str, db: Session = Depends(get_db)):
    a = db.query(KnowledgeArticle).filter(KnowledgeArticle.article_id == article_id).first()
    if not a:
        raise HTTPException(status_code=404, detail='Article not found')
    return success_response({
        'id': a.id,
        'article_id': a.article_id,
        'title': a.title,
        'category': a.category,
        'subcategory': a.subcategory,
        'content': a.content,
        'keywords': a.keywords or [],
        'tags': a.tags or [],
        'usage_count': a.usage_count,
        'success_rate': a.success_rate,
        'avg_resolution_time': a.avg_resolution_time,
        'effectiveness_score': a.effectiveness_score,
        'last_updated': a.last_updated,
        'review_date': a.review_date
    })

@router.post('/search')
def search_knowledge(body: KnowledgeSearchRequest, db: Session = Depends(get_db)):
    results = retrieve_knowledge(query=body.query, category=body.category, db=db, limit=body.limit)
    return success_response(results)

@router.post('/draft')
def create_draft_article(body: CreateDraftArticleRequest, db: Session = Depends(get_db)):
    # Create draft article
    new_id = f'KB-{200 + db.query(KnowledgeArticle).count()}'
    art = KnowledgeArticle(
        article_id=new_id,
        title=f'[DRAFT] {body.title}',
        category=body.category,
        subcategory='Draft Documentation',
        content=body.content or 'Draft created via Knowledge Gap resolution workflow.',
        keywords=body.keywords or ['draft', 'troubleshooting'],
        tags=['Draft', 'Under Review'],
        usage_count=0,
        success_rate=0.90,
        avg_resolution_time=2.5,
        effectiveness_score=0.92,
        last_updated=datetime.datetime.utcnow(),
        review_date=datetime.datetime.utcnow() + datetime.timedelta(days=7)
    )
    db.add(art)
    db.commit()
    db.refresh(art)

    return success_response({
        'status': 'Draft article created successfully',
        'article_id': art.article_id,
        'title': art.title
    })
