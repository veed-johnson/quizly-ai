export class DateAndTimeUtilities {
    public static GetCurrentTime(): Date{
        return new Date(new Date().toUTCString())
    }
    public static AddDays(date: Date, days: number): Date{
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    public static GetCurrentDate(): Date {
        const currentDate = this.GetCurrentTime();
        currentDate.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
        return currentDate;
    }
}