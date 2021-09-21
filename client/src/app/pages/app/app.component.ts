/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Direction, Point } from '@app/models/lettre.model';
import { ReserveService } from '@app/services/reserve.service';
import { VerifyService } from '@app/verify.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(private reserveService: ReserveService, private verifyService: VerifyService) {}

    ngOnInit(): void {
        // eslint-disable-next-line no-undef
        const taille = 7;
        const mesReserves = this.reserveService.getReserve(taille);
        // eslint-disable-next-line no-console
        console.log(mesReserves);
        // eslint-disable-next-line no-console
        // console.log('nombre de caracteres apres reserve de 7 = ' + this.reserveService.getNbreOfAvailableLetter());

        const p1 = new Point(2, 1);
        // eslint-disable-next-line no-console
        console.log('border test-> must be true ? : ' + this.verifyService.isFiting(p1, Direction.RIGHT, 'CANADA'));

        const p2 = new Point(2, 3);
        // eslint-disable-next-line no-console
        console.log('border test -> must be false ? : ' + this.verifyService.isFiting(p2, Direction.RIGHT, 'CANADA'));

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const p3 = new Point(4, 1);
        // eslint-disable-next-line no-console
        console.log('test with present character -> must be true ? : ' + this.verifyService.isFiting(p3, Direction.RIGHT, 'CANADA'));

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const p4 = new Point(4, 2);
        // eslint-disable-next-line no-console
        console.log('test with present character -> must be false ? : ' + this.verifyService.isFiting(p4, Direction.RIGHT, 'CANADA'));
    }
}
