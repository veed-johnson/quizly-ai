import { TimeUnit } from "../ApplicationEnums/TimeUnit";
import { TimeConstants } from "../Constants/TimeConstants";

export class DateAndTimeUtilities {
    public static GetCurrentTime = (): Date => {
        return new Date(new Date().toUTCString())
    }
    public static AddDays(date: Date, days: number): Date{
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    public static GetCurrentDate = (): Date => {
        const currentDate = this.GetCurrentTime();
        currentDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return currentDate;
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