import { IChat } from './chat';
export interface CommandFormat {
    format: string;
    description: string;
    allowed: boolean;
    notAllowedMessage: string;
    command: () => Promise<IChat> | IChat;
}
