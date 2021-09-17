import { Injectable } from '@angular/core';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    constructor(public rackService: ReserveService) {}

    placeLetter(ligne: number, colomne: number, lettre: string) {
        const caractere = this.rackService.findLetter(lettre);
    }
}
