export interface IChat {
    from: string;
    body: string;
}

export const SENDER: { computer: string; me: string; otherPlayer: string } = {
    computer: 'COMPUTER',
    me: 'ME',
    otherPlayer: 'OTHER_PLAYER',
};
