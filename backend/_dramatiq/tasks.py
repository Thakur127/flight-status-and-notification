import json
import dramatiq
from typing import Dict
from fastapi import HTTPException, status
from asgiref.sync import async_to_sync

from config.database import SessionLocal
from notification.models import Subscriber
from notification.crud import create_notification
from email_util import send_email_flight_status_change, send_email_flight_subscription


@dramatiq.actor
def send_flight_change_notification(data: Dict):
    async_to_sync(_send_flight_change_notification)(data)


async def _send_flight_change_notification(data: Dict):
    try:

        subject: str = data.get("subject")
        body = data.get("body")
        email_to: str = data.get("email_to")
        msg = f"Your flight {body.get('flight_id')} is {body.get('status')}. And it will depart from gate {body.get('departure_gate')}"

        # Send the email
        await send_email_flight_status_change(
            subject=subject, email_to=email_to, body=body, msg=msg
        )

        # Call actor to create the notification in the database
        create_flight_notification.send(
            {
                "message": msg,
                "method": "email",
                "email_to": email_to,
                "flight_id": body.get("flight_id"),
            }
        )

    except Exception as e:
        print(f"Failed to send notification: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@dramatiq.actor
def flight_subscription_notification(data: Dict):
    async_to_sync(_flight_subscription_notification)(data)


async def _flight_subscription_notification(data: Dict):
    try:
        print("Starting flight_subscription_notification actor")

        subject = data.get("subject")
        email_to = data.get("email_to")
        body = data.get("body")
        msg = f'You have subscribed to get notifications for flight {body.get("flight_id")}'

        await send_email_flight_subscription(
            subject=subject, email_to=email_to, body=body, msg=msg
        )
        print(f"Email sent to {email_to}")

        # Call actor to create the notification in the database
        create_flight_notification.send(
            {
                "message": msg,
                "method": "email",
                "email_to": email_to,
                "flight_id": body.get("flight_id"),
            }
        )

    except Exception as e:
        print(f"Error in flight_subscription_notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@dramatiq.actor
def create_flight_notification(data: Dict):
    async_to_sync(_create_flight_notification)(data)


async def _create_flight_notification(data: Dict):
    try:
        # Create a new database session
        db = SessionLocal()
        email_to: str = data.get("email_to")
        msg = data.get("message")
        method = data.get("method")
        flight_id = data.get("flight_id")

        # Log the notification in the database
        subscriber = db.query(Subscriber).filter(Subscriber.email == email_to).first()
        if subscriber:
            await create_notification(
                db,
                message=msg,
                method=method,
                subscriber_id=subscriber.id,
                flight_id=flight_id,
            )
            print(f"Notification created for subscriber {subscriber.email}")

    except Exception as e:
        print(f"Failed to create notification: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        # Close the database session
        db.close()
