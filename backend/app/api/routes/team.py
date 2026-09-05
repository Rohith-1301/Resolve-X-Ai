import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Specialist, TeamNote
from app.schemas.response import success_response
from app.schemas.team import ConsultRequest, SpecialistSchema
from app.schemas.customer import TeamNoteCreate

router = APIRouter(prefix='/api/team', tags=['team'])

@router.get('/specialists')
def get_specialists(db: Session = Depends(get_db)):
    specialists = db.query(Specialist).all()
    return success_response([
        {
            'id': s.id,
            'name': s.name,
            'title': s.title,
            'department': s.department,
            'expertise': s.expertise,
            'active_tickets': s.active_tickets,
            'max_capacity': s.max_capacity,
            'status': s.status,
            'avatar': s.avatar
        } for s in specialists
    ])

@router.get('/workload')
def get_workload(db: Session = Depends(get_db)):
    specialists = db.query(Specialist).all()
    workload = [
        {
            'name': s.name,
            'title': s.title,
            'active': s.active_tickets,
            'capacity': s.max_capacity,
            'utilization_percent': round((s.active_tickets / s.max_capacity) * 100, 1)
        } for s in specialists
    ]
    return success_response(workload)

@router.post('/consult')
def consult_specialist(body: ConsultRequest, db: Session = Depends(get_db)):
    '''
    Simulated expert consultation response (Specification 49).
    '''
    q_lower = body.question.lower()
    spec_name = 'Amit Sharma'
    mock_reply = 'Tower maintenance at Mumbai Tower 3 is currently ongoing. Optical distribution node re-synchronization is scheduled to complete within approximately 2 hours.'

    if 'bill' in q_lower or 'charge' in q_lower or '1499' in q_lower or '1,499' in q_lower:
        spec_name = 'Priya Nair'
        mock_reply = 'The ₹500 charge is an unbilled roaming excess from the previous billing cycle. Standard policy permits a one-time 50% goodwill credit if requested by a VIP customer.'
    elif 'sim' in q_lower or '5g' in q_lower:
        spec_name = 'Neha Kapoor'
        mock_reply = 'Advise the customer to toggle Airplane mode and manually select Standalone (SA) 5G mode in device cellular settings.'

    return success_response({
        'specialist_name': spec_name,
        'question': body.question,
        'response': mock_reply,
        'tag': 'Demo consultation',
        'timestamp': datetime.datetime.utcnow().strftime('%I:%M %p')
    })

@router.get('/notes/{customer_id}')
def get_customer_notes(customer_id: str, db: Session = Depends(get_db)):
    notes = db.query(TeamNote).filter(TeamNote.customer_id == customer_id).order_by(TeamNote.created_at.desc()).all()
    return success_response([
        {
            'id': n.id,
            'customer_id': n.customer_id,
            'author': n.author,
            'note': n.note,
            'created_at': n.created_at
        } for n in notes
    ])

@router.post('/notes')
def create_customer_note(body: TeamNoteCreate, db: Session = Depends(get_db)):
    note = TeamNote(
        customer_id=body.customer_id,
        author=body.author,
        note=body.note,
        created_at=datetime.datetime.utcnow()
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return success_response({
        'id': note.id,
        'customer_id': note.customer_id,
        'author': note.author,
        'note': note.note,
        'created_at': note.created_at
    })
