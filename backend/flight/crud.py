from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from .schema import FlightBase
from .models import Flight


def get_all_flights(db: Session, skip: int = 0, limit: int = 100) -> List[FlightBase]:
    try:
        # Query and sort by updated_at field
        flights: List[FlightBase] = (
            db.query(Flight)
            .order_by(Flight.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return flights

    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching flight data",
        )


def update_flight(db: Session, flight_id: str, flight_data: FlightBase) -> FlightBase:
    # Fetch the existing flight
    flight = db.query(Flight).filter(Flight.flight_id == flight_id).first()

    if flight is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found"
        )

    try:
        flight.airline = flight_data.airline
        flight.status = flight_data.status
        flight.arrival_gate = flight_data.arrival_gate
        flight.departure_gate = flight_data.departure_gate
        flight.scheduled_departure = flight_data.scheduled_departure
        flight.scheduled_arrival = flight_data.scheduled_arrival

        if flight_data.actual_departure:
            flight.actual_departure = flight_data.actual_departure
        if flight_data.actual_arrival:
            flight.actual_arrival = flight_data.actual_arrival

    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )

    # Commit the changes
    db.commit()

    return flight
