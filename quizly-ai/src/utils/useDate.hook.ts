import { startOfDay, isAfter } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useCallback } from "react";

const useDateComparison = () => {
  const saveCurrentDate = useCallback(() => {
    const currentDate = Date.now();
    localStorage.setItem("savedDate", currentDate.toString());
  }, []);

  const isDateExpired = useCallback(() => {
    const savedDateString = localStorage.getItem("savedDate");
    if (savedDateString) {
      const currentDate = Date.now();
      const savedDateToSydney = formatInTimeZone(
        parseInt(savedDateString),
        "Australia/Sydney",
        "yyyy-MM-dd HH:mm:ss"
      );

      const currentDateToSydney = formatInTimeZone(
        currentDate,
        "Australia/Sydney",
        "yyyy-MM-dd HH:mm:ss"
      );

      // console.log(
      //   "SAVED SYDNEY:",
      //   new Date(parseInt(savedDateString)),
      //   savedDateToSydney
      // );
      // console.log(
      //   "CURRENT SYDNEY:",
      //   new Date(currentDate),
      //   currentDateToSydney
      // );

      const startOfSavedDate = startOfDay(new Date(savedDateToSydney));
      const startOfCurrentDate = startOfDay(new Date(currentDateToSydney));

      // console.log("START CURRENT:", startOfCurrentDate);
      // console.log("START SAVED:", startOfSavedDate);

      // console.log(isAfter(startOfCurrentDate, startOfSavedDate));
      return isAfter(startOfCurrentDate, startOfSavedDate);
    } else {
      return true;
    }
  }, []);

  return { saveCurrentDate, isDateExpired };
};

export default useDateComparison;
