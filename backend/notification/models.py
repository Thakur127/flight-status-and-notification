from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import relationship
from config.database import Base


subscriber_flight = Table(
    "subscriber_flight",
    Base.metadata,
    Column("subscriber_id", Integer, ForeignKey("subscribers.id"), primary_key=True),
    Column("flight_id", String, ForeignKey("flights.flight_id"), primary_key=True),
    Column("subscribed_at", DateTime, default=func.now()),
)


class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    flights = relationship(
        "Flight", secondary=subscriber_flight, back_populates="subscribers"
    )
    notifications = relationship("Notification", back_populates="subscriber")


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True)
    message = Column(String)
    method = Column(String)
    subscriber_id = Column(Integer, ForeignKey("subscribers.id"))
    subscriber = relationship("Subscriber", back_populates="notifications")
    flight_id = Column(String, ForeignKey("flights.flight_id"))
    flight = relationship("Flight", back_populates="notifications")
    sent_at = Column(DateTime, default=func.now())
