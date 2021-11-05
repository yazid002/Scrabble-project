import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameSyncService } from '@app/services/game-sync.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(public gameSyncService: GameSyncService) {}

    ngOnInit(): void {
        // const gameState = this.gameSyncService.getGameState();
        //localStorage.clear();
        console.log('onInitapp');
        this.gameSyncService.recieveFromLocalStorege();
    }

    ngOnDestroy(): void {
        console.log('onDestroyApp');
        //this.gameSyncService.sendToLocalStorage();
    }
}
