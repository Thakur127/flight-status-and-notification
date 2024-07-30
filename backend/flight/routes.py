import asyncio, json
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Request,
)
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from config.database import get_db
from .crud import get_all_flights, update_flight
from .schema import FlightBase, FlightUpdate
from _dramatiq.tasks import send_flight_change_notification

router = APIRouter(
    prefix="/flights",
    tags=["flights"],
    responses={400: {"description": "Flight detail not found"}},
)


async def event_generator(db: Session):

    try:
        while True:
            try:
                flights = get_all_flights(db)
                flights_json = jsonable_encoder(flights)
                yield f"data: {json.dumps(flights_json)}\n\n"
            except Exception as e:
                print(f"Database error: {e}")
            await asyncio.sleep(3)
    finally:
        db.close()


@router.get("/info/all")
async def all_flights_info(request: Request, db: Session = Depends(get_db)):
    async def event_streamer():
        async for event in event_generator(db):
            yield event

    print("streaming flight event")
    return StreamingResponse(event_streamer(), media_type="text/event-stream")


@router.put("/update/{flight_id}")
async def update_flight_endpoint(
    flight_id: str, flight_data: FlightBase, db: Session = Depends(get_db)
) -> FlightUpdate:
    try:
        flight = update_flight(db, flight_id, flight_data)
        print(flight.subscribers)
        for subscriber in flight.subscribers:
            data = {
                "subject": "Flight Status Change",
                "email_to": subscriber.email,
                "body": jsonable_encoder(flight),
            }
            print("sending flight change notification")
            send_flight_change_notification.send(data=data)
        return flight
    except HTTPException as e:
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
