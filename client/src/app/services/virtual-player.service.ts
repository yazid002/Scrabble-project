import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    virtualPlayerSignal: Subscription;
    constructor(private gameService: GameService) {
        this.virtualPlayerSignal = this.gameService.virtualPlaySignal.subscribe(() => {
            console.log('signal received');
            this.play();
        });
    }
    private play() {
        console.log('Virtual player playing');
        this.skip();
    }
    
    private skip() {
        setTimeout(() => {
            console.log('Skipping turn');
            this.gameService.changeTurn();
        }, 3000);
    }
}
