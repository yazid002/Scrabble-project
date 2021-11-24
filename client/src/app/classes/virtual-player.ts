import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { Vec2 } from './vec2';

export type Direction = 'h' | 'v';
export interface WordNCoord {
    word: string;
    coord: Vec2;
    direction: Direction;
    points: number;
}
export type SortFct = (possibilities: WordNCoord[]) => WordNCoord[];
export type VoidFct = (service: VirtualPlayerService) => void;
export type NumberFct = () => number;
export const MAX_RACK_SIZE = 7;
