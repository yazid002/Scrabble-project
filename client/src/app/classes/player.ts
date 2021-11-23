import { GoalType } from '@app/enums/goals-enum';
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
    wordsMapping: Map<string, number>;
    goalsProgresses?: Map<GoalType, number>;
}
export const PLAYER = {
    realPlayer: 0,
    otherPlayer: 1,
};
