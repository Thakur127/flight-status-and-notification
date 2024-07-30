"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

const SubscribeForm = ({ flight_id, onClose }) => {
  const [isSubscribing, setIsubscribing] = useState(false);

  const { handleSubmit, register } = useForm();

  const subscribe = async (data) => {
    setIsubscribing(true);
    console.log("subscribing...");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/notification/subscribe",
        {
          flight_id: flight_id,
          email: data.email,
        }
      );
      console.log(res);
      if (onClose) onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsubscribing(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(subscribe)}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email")}
            className="form-input"
            placeholder="youremail@domain.com"
          />
        </div>
        <div className="mt-3 form-field">
          <Button disabled={isSubscribing}>Subscribe</Button>
        </div>
      </form>
    </div>
  );
};

export default SubscribeForm;
