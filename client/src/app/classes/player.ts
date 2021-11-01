import { ICharacter } from './letter';
import { PlacementParameters } from './placement';

export interface Player {
    name: string;
    id: number;
    rack: ICharacter[];
    points: number;
    placementParameters?: PlacementParameters;
}
