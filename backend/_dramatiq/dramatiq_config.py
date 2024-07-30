import dramatiq
from dramatiq.brokers.rabbitmq import RabbitmqBroker
from dramatiq.middleware import AsyncIO


# Create Rabbitmq instance and set broker
rabbitmq_broker = RabbitmqBroker(
    host="127.0.0.1",
    port="5672",
    # url="amqp://guest:guest@127.0.0.1:5672",
    heartbeat=60,
    connection_attempts=5,
    blocked_connection_timeout=30,
)

# Add middleware
rabbitmq_broker.add_middleware(AsyncIO())

# Set broker
dramatiq.set_broker(rabbitmq_broker)
