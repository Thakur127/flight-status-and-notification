from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import EmailStr
from sqlalchemy.orm import Session

from config.database import get_db
from .crud import create_subscription
from flight.models import Flight
from _dramatiq.tasks import flight_subscription_notification

router = APIRouter(prefix="/notification")


@router.post("/subscribe")
async def subscribe(request: Request, db: Session = Depends(get_db)):
    try:
        body = await request.json()
        flight_id: str = body.get("flight_id")
        email: EmailStr = body.get("email")
        result = create_subscription(db, flight_id=flight_id, email=email)
        try:
            flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
            data = {
                "subject": "Notification Subscription",
                "email_to": email,
                "body": jsonable_encoder(flight),
            }
            flight_subscription_notification.send(data=data)
        except Exception as e:
            print("Error email request: ", e)
            raise e
        return JSONResponse(content=result)
    except Exception as e:
        print(e)
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
