import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";

export class BaseEntity<T>{
    public _id: T;
    public createdAt: Date;
    public updatedAt: Date;
    public recordStatus: RecordStatus
}