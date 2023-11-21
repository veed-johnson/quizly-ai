export interface IMessageService {
    SendSMSToMultipleUsersAsync(users: string[], message: string): Promise<boolean>;
    SendSMSToSingleUserAsync(user: string, message: string): Promise<boolean>
}