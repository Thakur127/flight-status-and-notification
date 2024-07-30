import moment from "moment";

// Function to format a UTC date string for display in local timezone
export const formatDateLocalDisplay = (date) => {
  if (!date) return "";
  return moment(date).local().format("MMM Do YYYY, h:mm A");
};

// Converts a UTC date string to a local datetime string for input fields
export const formatDateForInput = (date) => {
  if (!date) return "";
  return moment(date).local().format("YYYY-MM-DDTHH:mm");
};

// Parses a local datetime string to a UTC ISO string
export const parseDateToUTC = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr);
};

export const convertToUTC = (localDateTimeString) => {
  // Split the input date-time string into components
  const [datePart, timePart] = localDateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create a new Date object with the specified local date and time components
  const localDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // Format the date to ISO string and keep the time part as it is
  const utcDateTimeString = localDate.toISOString().slice(0, -5) + ".000Z";

  return utcDateTimeString;
};
