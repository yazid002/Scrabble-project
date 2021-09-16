/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ReserveService } from '@app/services/reserve.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(private reserveService: ReserveService) {}

    ngOnInit(): void {
        // eslint-disable-next-line no-undef
        const taille = 7;
        const mesReserves = this.reserveService.getReserve(taille);
        // eslint-disable-next-line no-console
        console.log(mesReserves);
        // eslint-disable-next-line no-console
        console.log('nombre de caracteres apres reserve de 7 = ' + this.reserveService.getNbreOfAvailableLetter());
    }
}
