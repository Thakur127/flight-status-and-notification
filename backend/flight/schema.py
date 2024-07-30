from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FlightBase(BaseModel):
    flight_id: str
    airline: str
    status: str
    departure_gate: str
    arrival_gate: str
    scheduled_departure: datetime
    scheduled_arrival: datetime
    actual_departure: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None

    class Config:
        from_attributes = True


class FlightCreate(FlightBase):
    # Add any additional fields if needed for creation
    pass


class FlightUpdate(FlightBase):
    # Add any additional fields if needed for updates
    pass


class FlightResponse(FlightBase):
    created_at: datetime
    updated_at: datetime
