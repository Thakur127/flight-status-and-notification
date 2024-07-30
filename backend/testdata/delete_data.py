from config.database import SessionLocal
from flight.models import Flight
from notification.models import Notification, Subscriber, subscriber_flight


def clear_database():
    """
    Delete Table rows in database
    """

    db = SessionLocal()
    try:
        db.query(subscriber_flight).delete()
        db.query(Notification).delete()
        db.query(Flight).delete()
        db.query(Subscriber).delete()
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    print("clearing database...")
    clear_database()
    print("Database cleared successfully.")
