import { Vec2 } from './vec2';

export interface PlacementParameters {
    selectedCoord: Vec2;
    direction: boolean;
    selectedTilesForPlacement: Vec2[];
    selectedRackIndexesForPlacement: number[];
    wordToVerify: string[];
}
