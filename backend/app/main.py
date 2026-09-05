import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.db.database import engine, Base, SessionLocal
from app.api.routes import customers, tickets, knowledge, proactive, analytics, team
from app.db.seed import seed_database

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(name)s: %(message)s')
logger = logging.getLogger('resolveai')

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('Initializing database schema...')
    Base.metadata.create_all(bind=engine)
    # Check if seed is needed
    db = SessionLocal()
    try:
        from app.models.models import Customer
        if db.query(Customer).count() == 0:
            logger.info('Database empty. Automatically populating seed data...')
            seed_database(db)
        else:
            logger.info('Database already contains records.')
    finally:
        db.close()
    yield
    logger.info('ResolveAI backend shutting down.')

app = FastAPI(
    title='ResolveX — Enterprise AI Customer Support Platform',
    description='100% Python backend for telecom customer support resolution, decision engine, Customer 360, and proactive operations. Tagline: Understand. Resolve. Predict. Prevent.',
    version='2.0.0',
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Permissive for local dev & demo
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Include Routers
app.include_router(customers.router)
app.include_router(tickets.router)
app.include_router(knowledge.router)
app.include_router(proactive.router)
app.include_router(analytics.router)
app.include_router(team.router)

@app.get('/health', tags=['health'])
def health_check():
    return {
        'status': 'healthy',
        'service': 'ResolveX',
        'tagline': 'Understand. Resolve. Predict. Prevent.',
        'version': '2.0.0',
        'ai_provider': settings.AI_PROVIDER,
        'backend': 'Python FastAPI'
    }

# Mount Frontend static build so backend also serves the full website UI directly!
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Check for bundled static folder (inside backend/app/static) or frontend/dist
internal_static = os.path.abspath(os.path.join(os.path.dirname(__file__), 'static'))
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'dist'))
dist_dir = internal_static if os.path.exists(internal_static) else (frontend_dist if os.path.exists(frontend_dist) else None)

if dist_dir and os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, 'assets')
    if os.path.exists(assets_dir):
        app.mount('/assets', StaticFiles(directory=assets_dir), name='assets')

    @app.get('/{full_path:path}')
    def serve_spa(full_path: str):
        if full_path.startswith('api/') or full_path == 'health' or full_path.startswith('docs') or full_path.startswith('openapi.json'):
            raise HTTPException(status_code=404, detail='API route not found')
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, 'index.html'))
else:
    @app.get('/')
    def root():
        return {
            'service': 'ResolveX Enterprise AI Customer Support',
            'status': 'healthy',
            'docs': '/docs',
            'health': '/health'
        }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f'Unhandled error processing {request.url.path}: {exc}', exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            'success': False,
            'data': None,
            'error': {
                'code': 'INTERNAL_SERVER_ERROR',
                'message': str(exc)
            }
        }
    )

