from fastapi import HTTPException, status
from pydantic import EmailStr
from sqlalchemy.orm import Session

from .models import Subscriber, Notification, subscriber_flight
from flight.models import Flight


def create_subscription(db: Session, flight_id: str, email: EmailStr):
    if not flight_id or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Flight ID and email are required",
        )

    try:
        # Check if subscriber already exists
        subscriber = db.query(Subscriber).filter(Subscriber.email == email).first()
        if not subscriber:
            subscriber = Subscriber(email=email)
            db.add(subscriber)
            db.commit()
            db.refresh(subscriber)

        # Check if flight already exists
        flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()
        if not flight:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="flight_id is not valid"
            )

        # Check if the subscriber is already subscribed to the flight
        subscription_exists = (
            db.query(subscriber_flight)
            .filter(
                subscriber_flight.c.subscriber_id == subscriber.id,
                subscriber_flight.c.flight_id == flight.flight_id,
            )
            .first()
        )

        if not subscription_exists:
            stmt = subscriber_flight.insert().values(
                subscriber_id=subscriber.id,
                flight_id=flight.flight_id,
            )
            db.execute(stmt)
            db.commit()

        return {
            "message": "Subscription successful",
            "email": email,
            "flightId": flight_id,
        }
    except Exception as e:
        db.rollback()  # Rollback the transaction if there's an error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


async def create_notification(
    db: Session, message: str, method: str, subscriber_id: int, flight_id: str
):

    try:
        notification = Notification(
            message=message,
            method=method,
            subscriber_id=subscriber_id,
            flight_id=flight_id,
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
