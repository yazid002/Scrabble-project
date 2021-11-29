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
    wordsMapping: Map<string, number>;
}
export const PLAYER = {
    realPlayer: 0,
    otherPlayer: 1,
};
