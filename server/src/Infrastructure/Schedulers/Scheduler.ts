import { IScheduler } from "../../Application/Contracts/Schedulers/IScheduler";
import cron from 'node-cron';
export class Scheduler implements IScheduler{

    Execute = ( name: string, schedule: string, task: () => void, errorCallBack: (ex: Error) => void, timeZone: string = 'Australia/Sydney'): void => {
        try{
            cron.schedule(schedule, task, {
                scheduled: true,
                timezone: timeZone,
              });
        }
        catch(ex){
            switch(ex){
                case Error:
                    errorCallBack(ex);
                    break;
                default:
                    console.log(ex);
            }
        }
    }
}