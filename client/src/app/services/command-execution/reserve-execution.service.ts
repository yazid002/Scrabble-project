import { Injectable } from '@angular/core';
import { ReserveService } from '../reserve.service';

@Injectable({
    providedIn: 'root',
})
export class ReserveExecutionService {
    constructor(private reserveService: ReserveService) {}

    execute(): boolean {
        console.log(this.reserveService.alphabets);
        return true;
    }
}
