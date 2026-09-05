import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import ProactiveAlert, ProactiveAction
from app.schemas.response import success_response, error_response
from app.schemas.proactive import PrepareActionRequest, ApproveActionRequest
from app.services.proactive_service import get_proactive_alert_detail
from app.services.predictive_service import get_usage_opportunities

router = APIRouter(prefix="/api/proactive", tags=["proactive"])

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(ProactiveAlert).order_by(ProactiveAlert.created_at.desc()).all()
    return success_response([
        {
            "id": a.id,
            "alert_id": a.alert_id,
            "alert_type": a.alert_type,
            "title": a.title,
            "description": a.description,
            "location": a.location,
            "affected_customers": a.affected_customers,
            "severity": a.severity,
            "status": a.status,
            "estimated_resolution": a.estimated_resolution,
            "created_at": a.created_at
        } for a in alerts
    ])

@router.get("/opportunities")
def get_opportunities():
    opps = get_usage_opportunities()
    return success_response(opps)

@router.get("/alerts/{alert_id}")
def get_alert(alert_id: str, db: Session = Depends(get_db)):
    detail = get_proactive_alert_detail(db, alert_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Alert not found")
    return success_response(detail)

@router.post("/{alert_id}/prepare-action")
def prepare_action(alert_id: str, body: PrepareActionRequest, db: Session = Depends(get_db)):
    alert = db.query(ProactiveAlert).filter(ProactiveAlert.alert_id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    content = body.custom_content or (
        f"We're currently performing scheduled maintenance affecting broadband service in {alert.location}. "
        f"Our network team expects service to stabilize within approximately {alert.estimated_resolution}. "
        f"We apologize for the inconvenience."
    )

    action = ProactiveAction(
        alert_id=alert_id,
        action_type=body.action_type,
        content=content,
        status="Prepared"
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    return success_response({
        "action_id": action.id,
        "alert_id": alert_id,
        "action_type": action.action_type,
        "content": action.content,
        "status": action.status
    })

@router.post("/{alert_id}/approve-action")
def approve_action(alert_id: str, body: ApproveActionRequest, db: Session = Depends(get_db)):
    action = db.query(ProactiveAction).filter(ProactiveAction.id == body.action_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")

    action.status = "Sent (Simulated)"
    action.approved_by = body.agent_id
    action.approved_at = datetime.datetime.utcnow()
    db.commit()

    return success_response({
        "action_id": action.id,
        "status": "Sent (Simulated)",
        "approved_by": action.approved_by,
        "approved_at": action.approved_at,
        "message": f"Simulated communication dispatched to {234 if alert_id == 'ALT-1001' else 50} affected subscribers."
    })
