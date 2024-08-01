import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  formatDateForInput,
  parseDateToUTC,
  convertToUTC,
} from "@/lib/datetime";
import { axiosInstance } from "@/lib/axios";

const UpdateFlightForm = ({ flight, className, onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...flight,
      scheduled_departure: formatDateForInput(flight.scheduled_departure),
      scheduled_arrival: formatDateForInput(flight.scheduled_arrival),
      actual_departure: formatDateForInput(flight.actual_departure),
      actual_arrival: formatDateForInput(flight.actual_arrival),
    },
  });

  const DateTimeField = ({ control, name }) => {
    return (
      <div>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <input
              type="datetime-local"
              value={
                field.value
                  ? formatDateForInput(parseDateToUTC(field.value))
                  : ""
              }
              onChange={(e) => {
                // console.log(e.target.value);
                // console.log(convertToUTC(e.target.value));
                field.onChange(e.target.value);
              }}
              className="form-input w-full"
            />
          )}
        />
      </div>
    );
  };

  const updateFlight = async (data) => {
    setIsUpdating(true);
    const correctData = {
      ...data,
      scheduled_departure: convertToUTC(data.scheduled_departure),
      scheduled_arrival: convertToUTC(data.scheduled_arrival),
      actual_arrival: data.actual_arrival
        ? convertToUTC(data.actual_arrival)
        : null,
      actual_departure: data.actual_departure
        ? convertToUTC(data.actual_departure)
        : null,
    };
    try {
      const res = await axiosInstance.put(
        `/flights/update/${data.flight_id}`,
        correctData
      );
      if (onClose) onClose();
      toast({
        title: "Flight Data updated",
        description: `Data has been updated successfully for the flight ${data.flight_id}`,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed",
        description: `Updation failed for flight ${data.flight_id}`,
        variant: "destructive",
        // action: (
        //   <ToastAction onClick={handleSubmit(updateFlight)}>
        //     Try Again
        //   </ToastAction>
        // ),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <form className={cn(className)} onSubmit={handleSubmit(updateFlight)}>
        <div className="form-field mb-4">
          <label htmlFor="flight_id" className="block mb-2">
            Flight Id
          </label>
          <input
            disabled
            id="flight_id"
            {...register("flight_id")}
            className="form-input opacity-50 w-full"
          />
          <p className="text-red-500">{errors.flight_id?.message}</p>
        </div>
        <div className="form-field mb-4">
          <label htmlFor="airline" className="block mb-2">
            Airline
          </label>
          <input
            id="airline"
            {...register("airline")}
            className="form-input w-full"
          />
          <p className="text-red-500">{errors.airline?.message}</p>
        </div>
        <div className="form-field mb-4">
          <label htmlFor="status" className="block mb-2">
            Status
          </label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <select id="status" {...field} className="form-input w-full">
                <option value="Delayed">Delayed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Time">On Time</option>
              </select>
            )}
          />
          <p className="text-red-500">{errors.status?.message}</p>
        </div>
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="form-field mb-4">
            <label htmlFor="departure_gate" className="block mb-2">
              Departure Gate
            </label>
            <input
              id="departure_gate"
              {...register("departure_gate")}
              className="form-input w-full"
            />
            <p className="text-red-500">{errors.departure_gate?.message}</p>
          </div>
          <div className="form-field mb-4">
            <label htmlFor="arrival_gate" className="block mb-2">
              Arrival Gate
            </label>
            <input
              id="arrival_gate"
              {...register("arrival_gate")}
              className="form-input w-full"
            />
            <p className="text-red-500">{errors.arrival_gate?.message}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="form-field mb-4">
            <label htmlFor="scheduled_departure" className="block mb-2">
              Scheduled Departure
            </label>
            <DateTimeField control={control} name={"scheduled_departure"} />
            <p className="text-red-500">
              {errors.scheduled_departure?.message}
            </p>
          </div>
          <div className="form-field mb-4">
            <label htmlFor="scheduled_arrival" className="block mb-2">
              Scheduled Arrival
            </label>
            <DateTimeField control={control} name={"scheduled_arrival"} />
            <p className="text-red-500">{errors.scheduled_arrival?.message}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="form-field mb-4">
            <label htmlFor="actual_departure" className="block mb-2">
              Actual Departure
            </label>
            <DateTimeField control={control} name={"actual_departure"} />
            <p className="text-red-500">{errors.actual_departure?.message}</p>
          </div>
          <div className="form-field mb-4">
            <label htmlFor="actual_arrival" className="block mb-2">
              Actual Arrival
            </label>
            <DateTimeField control={control} name={"actual_arrival"} />
            <p className="text-red-500">{errors.actual_arrival?.message}</p>
          </div>
        </div>
        <div className="space-x-2">
          <Button
            disabled={isUpdating}
            type="submit"
            className="w-full md:w-auto gap-2"
          >
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Submit</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFlightForm;
