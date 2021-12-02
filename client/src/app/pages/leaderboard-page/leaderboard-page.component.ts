import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '@app/services/leaderboard.service';
import { SoundManagerService } from '@app/services/sound-manager.service';

@Component({
    selector: 'app-leaderboard-page',
    templateUrl: './leaderboard-page.component.html',
    styleUrls: ['./leaderboard-page.component.scss'],
})
export class LeaderboardPageComponent implements OnInit {
    constructor(public leaderboardService: LeaderboardService, public soundManagerService: SoundManagerService) {}

    async ngOnInit() {
        await this.leaderboardService.fetchClassic();
        await this.leaderboardService.fetchLog2990();
    }

    playClickOnButtonAudio() {
        this.soundManagerService.playClickOnButtonAudio();
    }
}
