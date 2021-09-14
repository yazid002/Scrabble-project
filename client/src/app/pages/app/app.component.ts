import { Component, OnInit } from '@angular/core';
import { LettreService } from '@app/services_/serve.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private reserveService: LettreService) {}

    ngOnInit(): void {
        const mesReserves = this.reserveService.getReserve(7);
        // eslint-disable-next-line no-console
        console.log(mesReserves);
        // eslint-disable-next-line no-console
        console.log('nombre de caracteres apres reserve de 7 = ' + this.reserveService.getNbreOfAvailableLetter());
    }
}
