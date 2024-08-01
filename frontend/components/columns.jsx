"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          text_color = "text-green-700 bg-green-200";
          break;
        case "delayed":
          text_color = "text-yellow-700 bg-yellow-200";
          break;
        case "cancelled":
          text_color = "text-red-700 bg-red-200";
          break;
        default:
          text_color = "";
      }
      return (
        <span className={`${text_color} py-0.5 px-1 rounded-md text-nowrap`}>
          {value}
        </span>
      );
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
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
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
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
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
      if (!value) return <span>NA</span>;
      const date = new Date(value);
      return <span>{formatDateLocalDisplay(date)}</span>;
    },
  },
  {
    header: "Actual Arrival",
    accessorKey: "actual_arrival",
    cell: (info) => {
      const value = info.getValue();
      if (!value) return <span>NA</span>;
      const date = new Date(value);
      return <span>{formatDateLocalDisplay(date)}</span>;
    },
  },
];
