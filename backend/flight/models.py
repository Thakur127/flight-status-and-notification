from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from config.database import Base
from notification.models import subscriber_flight


class Flight(Base):
    __tablename__ = "flights"

    flight_id = Column(String, primary_key=True)
    airline = Column(String, nullable=False)
    status = Column(String)
    departure_gate = Column(String(5), nullable=False)
    arrival_gate = Column(String(5), nullable=False)
    scheduled_departure = Column(DateTime)
    scheduled_arrival = Column(DateTime)
    actual_departure = Column(DateTime, nullable=True)
    actual_arrival = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    subscribers = relationship(
        "Subscriber", secondary=subscriber_flight, back_populates="flights"
    )
    notifications = relationship("Notification", back_populates="flight")
