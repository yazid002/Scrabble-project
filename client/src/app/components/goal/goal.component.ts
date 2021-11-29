import { Component, Input } from '@angular/core';
import { Goal } from '@app/classes/goal';
import { PLAYER, Player } from '@app/classes/player';
import { GameService } from '@app/services/game.service';

@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss'],
})
export class GoalComponent {
    @Input() isPublic: boolean;
    @Input() goal: Goal;
    @Input() player: Player;
    playerIndex = PLAYER;
    constructor(public gameService: GameService) {}
}
