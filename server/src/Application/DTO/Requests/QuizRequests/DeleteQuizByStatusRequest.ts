import { DateAndTimeUtilities } from "../../../../Application/Common/Utilities/DateAndTimeUtilities";

export class DeleteQuizByStatusRequest {
    public status: string;
    public softDelete: boolean;
    public referenceDate: Date;
    public constructor(status: string, softDelete?: boolean, referenceDate?: Date){
        this.status = status;
        this.softDelete = softDelete ? softDelete : true; // soft delete means we would reset their status to archived or deleted
        this.referenceDate = referenceDate ? referenceDate : DateAndTimeUtilities.GetCurrentSydneyDayStartTime();
    }
}