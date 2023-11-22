import { TimeUnit } from "../ApplicationEnums/TimeUnit";
import { TimeConstants } from "../Constants/TimeConstants";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'
dayjs().format()
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Australia/Sydney")
export class DateAndTimeUtilities {
    
    public static GetCurrentTime = (): Date => {
        return dayjs().utc().toDate()
    }

    /**
     * 
     * @returns current time based on Australia/Sydney time
     */
    public static GetCurrentSydneyTime = (): Date => {
        
        // Get the current time in Sydney timezone
        const sydneyTime = dayjs().utc().toDate();
        const minuteOffset = this.GetSydneyTimeInRelationToUtcInMinutes();
        const currentSydneyTime = dayjs(sydneyTime).add(minuteOffset, 'minute')
        // Create a Date object from the formatted string
        return currentSydneyTime.toDate();
    }

    public static AddDays(date: Date, days: number): Date{
        // Create a dayjs object from the input date
      

        // Create a dayjs object from the input date
        const result = dayjs(date);

        // Add the specified number of days
        const newDate = result.add(days, 'day');

        // Set the time zone to 'Australia/Sydney'
        const sydneyDate = dayjs(newDate).tz('Australia/Sydney');
        // Convert the result back to a JavaScript Date object
        return sydneyDate.toDate();
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

    public static GetCurrentSydneyDayStartTime = (): Date => {
        // Get the current date and time in 'Australia/Sydney' time zone
        // 
        
        // get utc date today
        let sydneyCurrentTime = this.GetCurrentSydneyTime();
        let startOfDay = new Date(sydneyCurrentTime);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const minuteOffset = this.GetSydneyTimeInRelationToUtcInMinutes();
        const startOfCurrentSydneyDay = dayjs(startOfDay).add(-1 * minuteOffset, 'minute')
        return startOfCurrentSydneyDay.toDate();
        // return this.convertUtcTimeToSydneyTime(startOfDay);
    }

    public static ConvertUtcTimeToSydneyTime = (date: Date ): Date => {
        const minuteOffset = this.GetSydneyTimeInRelationToUtcInMinutes();
        const sydneyTime = dayjs(date).add(minuteOffset, 'minute')
        return sydneyTime.toDate();
    }

    public static GetDayEndSydneyTime = (date: Date) : Date => {
         // Extend dayjs with plugins
        const endOfUTCDay = dayjs(date).utc().endOf('day');
        // add 
        
        const minuteOffset = this.GetSydneyTimeInRelationToUtcInMinutes();
        let endOfDaySydneyTime = endOfUTCDay.add(-1 * minuteOffset, 'minute');
        endOfDaySydneyTime = endOfDaySydneyTime.add((60 * 60 * 24), 'second')
        
        return this.GetSydneyDayEnd(date);
    }

    public static GetDayStartSydneyTime = (date: Date) : Date => {
        // Extend dayjs with plugins
        const dayEnd = this.GetSydneyDayEnd(date);
        const dayStart = dayjs(dayEnd).add((-1 * (60 * 60 * 24)) + 1, 'second')
        return dayStart.toDate();
    }

    public static GetStartDateForDate = (date: Date): Date => {
        // Extend dayjs with plugins
        const dayEnd = this.GetSydneyDayEnd(date);
        const dayStart = dayjs(dayEnd).add((-1 * (60 * 60 * 24)) + 1, 'second')
        return dayStart.toDate();
    }

    public static Delay =  (timeInMilliSeconds: number): Promise<void> => {
        
        return new Promise(resolve => {
            return setTimeout(resolve, timeInMilliSeconds)
        });
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

    private static GetSydneyDayEnd = (date: Date) : Date => {
        // Extend dayjs with plugins
       const endOfUTCDay = dayjs(date).utc().endOf('day');
       // add 
       
       const minuteOffset = this.GetSydneyTimeInRelationToUtcInMinutes();
       let endOfDaySydneyTime = endOfUTCDay.add(-1 * minuteOffset, 'minute');
       endOfDaySydneyTime = endOfDaySydneyTime.add((60 * 60 * 24), 'second')
       
       return endOfDaySydneyTime.toDate();
   }

   private static GetSydneyTimeInRelationToUtcInMinutes(){
        const utcTimeNow = dayjs().utc();
        let currentSydneyTime = utcTimeNow.tz('Australia/Sydney');
        let minuteOffset = currentSydneyTime.utcOffset();
        return minuteOffset;
    }
    private static convertUtcTimeToSydneyTime = (datetime: Date): Date => {
        const utcTimeNow = dayjs(datetime).utc();
        let currentSydneyTime = utcTimeNow.tz('Australia/Sydney');
        let minuteOffset = currentSydneyTime.utcOffset();
        const updatedSydneyTime = utcTimeNow.add(minuteOffset, 'minute')
        return updatedSydneyTime.toDate();
    }
}