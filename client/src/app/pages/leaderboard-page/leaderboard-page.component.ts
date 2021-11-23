import { Component } from '@angular/core';
import { Leaderboard, LeaderboardService } from '@app/services/leaderboard.service';

@Component({
    selector: 'app-leaderboard-page',
    templateUrl: './leaderboard-page.component.html',
    styleUrls: ['./leaderboard-page.component.scss'],
})
export class LeaderboardPageComponent {
    leaderboardClassic: Leaderboard[];
    leaderboardMode2990: Leaderboard[];

    constructor(public leaderboardService: LeaderboardService) {
        // this.leaderboardClassic = this.leaderboardService.leaderboardClassic;
    }

    // getAllPlayers(): void {
    //     this.leaderboardClassic = this.leaderboardService.leaderboardClassic;
    // }
}
