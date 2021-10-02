import { IChat } from './chat';

export interface CommandFormat {
    format: string;
    description: string;
    command: () => Promise<IChat> | IChat;
}
