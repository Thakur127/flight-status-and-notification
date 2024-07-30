"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import SubscribeForm from "../Forms/SubscribeForm";
import { ResponseDialog } from "../ResponsiveDialog";

const FlightStatusDropdownMenuOption = ({ flight }) => {
  const [subscribeNotficationOpen, setSubscribeNotificationOpen] =
    useState(false);

  return (
    <>
      <ResponseDialog
        open={subscribeNotficationOpen}
        setOpen={setSubscribeNotificationOpen}
        title={"Subscribe"}
        description={`Subscribing the notification for flight ${flight.flight_id}`}
      >
        <SubscribeForm
          flight_id={flight.flight_id}
          onClose={() => setSubscribeNotificationOpen(false)}
        />
      </ResponseDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(flight.flight_id)}
            className="cursor-pointer"
          >
            Copy flight ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              onClick={() => setSubscribeNotificationOpen(true)}
              className=""
            >
              Subscribe for notification
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FlightStatusDropdownMenuOption;
