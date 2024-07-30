from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.database import engine, Base
from flight import routes as flight_routes
from notification import routes as notification_routes


from _dramatiq.dramatiq_config import *

# Create table in database
Base.metadata.create_all(bind=engine)


# Create FastAPI app instance
app = FastAPI(root_path="/api")


# Add routes
app.include_router(flight_routes.router)
app.include_router(notification_routes.router)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run the application
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
