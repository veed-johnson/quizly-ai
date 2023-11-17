
export interface IScheduler {

    Execute( name: string, schedule: string, task: () => void, errorCallBack: (ex: Error) => void): void;
}