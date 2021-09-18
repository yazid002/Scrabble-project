import { Message } from './message';

export const COMMAND_ERRORS: { computer: string; me: string; otherPlayer: string } = {
    computer: 'COMPUTER',
    me: 'ME',
    otherPlayer: 'OTHER_PLAYER',
};

export interface CommandError {
    code: number;
    message: Message;
}
