import { GoalType } from '@app/enums/goals-enum';
import { Player } from './player';

export interface Goal {
    description: string;
    bonus: number;
    complete: boolean;
    completedBy?: Player;
    goalType: GoalType;
    usesWord: boolean;
    progress?: number;
}
