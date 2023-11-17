

export interface IMessageAllSubscribers{
    execute(message: string): Promise<void>
}