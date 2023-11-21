import { TimeUnit } from "../ApplicationEnums/TimeUnit";
import { TimeConstants } from "../Constants/TimeConstants";

export class DateAndTimeUtilities {
    /**
     * 
     * @returns current time based on Australia/Sydney time
     */
    public static GetCurrentTime = (): Date => {
        // Get the current time in Sydney timezone
        const sydneyTimeString = new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' });

        // Create a Date object from the formatted string
        return new Date(sydneyTimeString);
    }
    public static AddDays(date: Date, days: number): Date{
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        result.toLocaleString('en-US', { timeZone: 'Australia/Sydney' });
        return new Date(result);
    }

    public static AreDatesOnSameDay = (date1: Date, date2: Date): boolean => {
        
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const day1 = date1.getDate();
        
        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
        const day2 = date2.getDate();
        
        return year1 === year2 && month1 === month2 && day1 === day2;
          
    }

    public static GetCurrentDate = (): Date => {
        const currentDate = this.GetCurrentTime();
        currentDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return currentDate;
    }

    public static GetStartDateForDate = (date: Date): Date => {
        // const currentDate = this.GetCurrentTime();
        date.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return date;
    }

    public static ConvertTimeToSeconds = (duration: number, currentTimeunit: TimeUnit): number => {
        let timeInSeconds = 0;
        switch(currentTimeunit){
            case TimeUnit.second:
                timeInSeconds = duration;
                break;
            case TimeUnit.minute:
                timeInSeconds = TimeConstants.SECONDS_IN_MINUTE * duration;
                break;
            case TimeUnit.hour:
                timeInSeconds = TimeConstants.MINUTES_IN_AN_HOUR * TimeConstants.SECONDS_IN_MINUTE * duration;
                break;
            case TimeUnit.day:
                timeInSeconds = TimeConstants.HOURS_IN_A_DAY * TimeConstants.MINUTES_IN_AN_HOUR * TimeConstants.SECONDS_IN_MINUTE * duration;
                break;
            case TimeUnit.week:
                timeInSeconds = TimeConstants.DAYS_IN_A_WEEK * TimeConstants.HOURS_IN_A_DAY * TimeConstants.MINUTES_IN_AN_HOUR * TimeConstants.SECONDS_IN_MINUTE * duration;
                break;
            case TimeUnit.month:
                timeInSeconds = TimeConstants.DAYS_IN_A_MONTH * TimeConstants.HOURS_IN_A_DAY * TimeConstants.MINUTES_IN_AN_HOUR * TimeConstants.SECONDS_IN_MINUTE * duration;
                break;
            case TimeUnit.year:
                timeInSeconds = TimeConstants.DAYS_IN_A_YEAR * TimeConstants.HOURS_IN_A_DAY * TimeConstants.MINUTES_IN_AN_HOUR * TimeConstants.SECONDS_IN_MINUTE * duration;
                break;
            default:
                break;

        }
        return timeInSeconds;
    }
}