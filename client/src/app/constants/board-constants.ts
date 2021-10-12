import { CaseStyle } from '@app/classes/case-style';

export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
export const SQUARE_NUMBER = 15;
export const SQUARE_WIDTH = DEFAULT_WIDTH / SQUARE_NUMBER;
export const SQUARE_HEIGHT = DEFAULT_HEIGHT / SQUARE_NUMBER;
export const TILE: CaseStyle = { color: 'NavajoWhite', font: '30px serif' };
export const bonuses: string[] = ['dl', 'tw', 'tl', 'dw'];


// Points
export const INVALID_NUMBER = -1;
export const BINGO_BONUS = 50;
export const BINGO_LENGTH = 7;
