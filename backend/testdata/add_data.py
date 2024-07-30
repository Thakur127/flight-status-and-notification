import datetime

from config.database import SessionLocal

from flight.models import Flight
from notification.models import Notification, Subscriber, subscriber_flight
import random


def initialize_flights():
    """
    Populate flights table
    """

    db = SessionLocal()
    try:
        db.query(subscriber_flight).delete()
        db.query(Notification).delete()
        db.query(Flight).delete()
        db.query(Subscriber).delete()
        db.commit()
    except:
        pass
    try:

        status = ["On Time", "Delayed", "Cancelled"]
        airline = [
            "Air Asia India",
            "Air India",
            "Air India Express",
            "Go First",
            "IndiGo",
            "SpiceJet",
            "Vistara",
            "AIX Connect",
            "Allegiant Air",
            "Emirates",
            "Air Arabia",
            "Etihad",
        ]
        gate = ["A", "B", "C"]
        flights_data = []

        base_scheduled_departure = datetime.datetime.utcnow()

        for i in range(50):
            flight_id = f"FL{i+1001:04}"
            scheduled_departure = base_scheduled_departure + datetime.timedelta(hours=i)
            scheduled_arrival = scheduled_departure + datetime.timedelta(hours=3)

            flight = Flight(
                flight_id=flight_id,
                airline=random.choice(airline),
                status=random.choice(status),
                departure_gate=random.choice(gate) + str(random.randint(1, 10)),
                arrival_gate=random.choice(gate) + str(random.randint(1, 10)),
                scheduled_departure=scheduled_departure,
                scheduled_arrival=scheduled_arrival,
            )

            flights_data.append(flight)

        for flight in flights_data:
            db.add(flight)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    print("adding flight data")
    initialize_flights()
    print("flight data added successfully")
