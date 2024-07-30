import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, XIcon } from "lucide-react";

import UpdateFlightForm from "../Forms/UpdateFlightForm";
import { useState } from "react";
import { ResponseDialog } from "../ResponsiveDialog";

const DropdownMenuOption = ({ flight }) => {
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [drawerOpen, setDrawerOpen] = useState(false);

  const [flightUpdateOpen, setFlightUpdateOpen] = useState(false);

  return (
    <>
      <ResponseDialog
        open={flightUpdateOpen}
        setOpen={setFlightUpdateOpen}
        title={"Update Flight"}
        description={`You are updating the flight ${flight.flight_id}`}
      >
        <UpdateFlightForm
          flight={flight}
          onClose={() => setFlightUpdateOpen(false)}
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
            <button onClick={() => setFlightUpdateOpen(true)} className="">
              Update Flight
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default DropdownMenuOption;
