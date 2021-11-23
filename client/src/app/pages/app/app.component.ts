/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-console */
import { Component, OnInit } from '@angular/core';
import { GameSyncService } from '@app/services/game-sync.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(public gameSyncService: GameSyncService) {}
    ngOnInit(): void {}
}
