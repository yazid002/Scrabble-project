import { ICharacter } from './letter';

export interface Player {
    name: string;
    id: number;
    rack: ICharacter[];
    points: number;
}
export const PLAYER = {
    realPlayer: 0,
    otherPlayer: 1,
};
