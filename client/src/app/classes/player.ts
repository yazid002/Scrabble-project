import { ICharacter } from './letter';

export interface Player {
    name: string;
    id: number;
    rack: ICharacter[];
    points: number;
    won?: string;
    placeInTenSecondsGoalCounter: number;
    turnWithoutSkipAndExchangeCounter: number;
    words: string[];
}
export const PLAYER = {
    realPlayer: 0,
    otherPlayer: 1,
};
