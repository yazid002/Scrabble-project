import { IChat } from './chat';

export interface CommandFormat {
    regex: string;
    shortDescription: string;
    wideDescription: string;
    command: () => Promise<IChat> | IChat;
}
