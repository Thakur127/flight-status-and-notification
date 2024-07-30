"use client";

import { useState, useEffect } from "react";
import { columns } from "./columns";
import DataTable from "../DataTable";

const Dashboard = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8000/api/flights/info/all"
    );

    eventSource.onopen = () => {
      console.log("SSE connection established");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (JSON.stringify(flights) !== JSON.stringify(data)) {
          setFlights(data);
        }
      } catch (error) {
        console.log("Error parsing JSON: ", error, "Event data: ", event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error: ", error);
      eventSource.close();
    };

    // Cleanup the SSE connection when the component unmounts
    return () => {
      console.log("closing connection");
      eventSource.close();
    };
  }, [flights]);

  return (
    <div>
      <DataTable data={flights} columns={columns} />
    </div>
  );
};

export default Dashboard;
