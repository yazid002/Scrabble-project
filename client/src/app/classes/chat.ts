export interface IChat {
    from: string;
    body: string;
}
export interface IComputerResponse {
    success: boolean;
    response: IChat;
}
export const SENDER: { computer: string; me: string; otherPlayer: string } = {
    computer: 'COMPUTER',
    me: 'ME',
    otherPlayer: 'OTHER_PLAYER',
};
