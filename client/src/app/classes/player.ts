import { ICharacter } from './letter';

export interface Player {
    name: string;
    turnWithoutSkipAndExchangeCounter: number;
    id: number;
    rack: ICharacter[];
    points: number;
    won?: string;
    placeInTenSecondsGoalCounter: number;
    words: string[];
}
export const PLAYER = {
    realPlayer: 0,
    otherPlayer: 1,
};
