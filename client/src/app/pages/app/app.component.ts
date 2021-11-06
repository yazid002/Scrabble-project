import { Component } from '@angular/core';
import { GameSyncService } from '@app/services/game-sync.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(public gameSyncService: GameSyncService) {}
    // TODO: NE PAS OUBLIER D'ENLEVER CES COMMENTAIRES
    // ngOnInit(): void {
    //
    //     // const gameState = this.gameSyncService.getGameState();
    //     // localStorage.clear();
    //     this.gameSyncService.recieveFromLocalStorege();
    // }

    // // TODO: NE PAS OUBLIER D'ENLEVER CES COMMENTAIRES
    // // ngOnDestroy(): void {
    // //     // this.gameSyncService.sendToLocalStorage();
    // // }
}
