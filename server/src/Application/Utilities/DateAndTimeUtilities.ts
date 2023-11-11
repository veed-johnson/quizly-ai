export class DateAndTimeUtilities {
    public static GetCurrentUTCTime(): Date{
        return new Date(new Date().toUTCString())
    }
    public static AddDays(date: Date, days: number): Date{
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}