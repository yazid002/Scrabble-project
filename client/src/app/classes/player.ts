import { Goal } from './goal';
import { ICharacter } from './letter';
import { PlacementParameters } from './placement';

export interface Player {
    name: string;
    id: number;
    rack: ICharacter[];
    points: number;
    // TODO: enlever si non utilisé
    placementParameters?: PlacementParameters;
    won?: string;
    goal: Goal[];
}
export const PLAYER = {
    realPlayer: 0,
    otherPlayer: 1,
};
