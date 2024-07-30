"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import FlightStatusDropdownMenuOption from "./FlightStatusDropdownMenuOption";
import { formatDateLocalDisplay } from "@/lib/datetime";

export const columns = [
  {
    header: "Flight ID",
    accessorKey: "flight_id",
  },
  {
    header: "Airline",
    accessorKey: "airline",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const value = info.getValue();
      let text_color = "";
      switch (value.toLowerCase()) {
        case "on time":
          text_color = "text-green-500";
          break;
        case "delayed":
          text_color = "text-yellow-500";
          break;
        case "cancelled":
          text_color = "text-red-500";
          break;
        default:
          text_color = "";
      }
      return <span className={`${text_color}`}>{value}</span>;
    },
  },
  {
    header: "Departure Gate",
    accessorKey: "departure_gate",
  },
  {
    header: "Arrival Gate",
    accessorKey: "arrival_gate",
  },
  {
    accessorKey: "scheduled_departure",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Schedule Departure
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue();
      if (!value) return;
      const date = new Date(value);
      return <span>{formatDateLocalDisplay(date)}</span>;
    },
  },
  {
    accessorKey: "scheduled_arrival",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Schedule Arrival
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => {
      const value = info.getValue();
      if (!value) return;
      const date = new Date(value);
      return <span>{formatDateLocalDisplay(date)}</span>;
    },
  },
  {
    header: "Actual Departure",
    accessorKey: "actual_departure",
    cell: (info) => {
      const value = info.getValue();
      if (!value) return;
      const date = new Date(value);
      return <span>{formatDateLocalDisplay(date)}</span>;
    },
  },
  {
    header: "Actual Arrival",
    accessorKey: "actual_arrival",
    cell: (info) => {
      const value = info.getValue();
      if (!value) return;
      const date = new Date(value);
      return <span>{formatDateLocalDisplay(date)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const flight = row.original;

      return <FlightStatusDropdownMenuOption flight={flight} />;
    },
  },
];
