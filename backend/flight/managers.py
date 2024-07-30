from fastapi import WebSocket
from typing import List
import asyncio


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, connection: WebSocket, message):
        try:
            await connection.send_json(message)
        except Exception as e:
            print(e)
            await self.disconnect(connection)

    async def broadcast(self, message):

        tasks = [
            connection.send_json(message) for connection in self.active_connections
        ]

        await asyncio.gather(*tasks)
