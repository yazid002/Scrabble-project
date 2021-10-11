import { Injectable } from '@angular/core';
import { Player } from '@app/classes/player';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { ReserveService } from './reserve.service';
import { UserSettingsService } from './user-settings.service';

export const REAL_PLAYER = 0;
export const COMPUTER = 0;
@Injectable({
    providedIn: 'root',
})
export class GameService {
    players: Player[] = [];
    currentTurn: number;
    constructor(private userSettingsService: UserSettingsService, private reserveService: ReserveService) {
        this.initializePlayers();
        this.randomTurn();
    }

    private initializePlayers() {
        const realPlayer: Player = {
            id: REAL_PLAYER,
            name: this.userSettingsService.nameOption.userChoice,
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
        };
        this.players.push(realPlayer);
        const computer: Player = {
            id: COMPUTER,
            name: this.userSettingsService.computerName,
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
        };
        this.players.push(computer);
    }
    private randomTurn() {
        this.currentTurn = Math.floor(Math.random());
    }
}
