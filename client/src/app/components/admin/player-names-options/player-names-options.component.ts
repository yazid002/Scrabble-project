import { Component, OnInit } from '@angular/core';
import { NamesService } from '@app/services/admin/names.service';

@Component({
    selector: 'app-player-names-options',
    templateUrl: './player-names-options.component.html',
    styleUrls: ['./player-names-options.component.scss'],
})
export class PlayerNamesOptionsComponent implements OnInit {
    constructor(public nameService: NamesService) {}

    async ngOnInit() {
        await this.nameService.fetchNames();
    }
}
