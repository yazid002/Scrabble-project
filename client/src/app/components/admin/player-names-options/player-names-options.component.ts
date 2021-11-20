import { Component, OnInit } from '@angular/core';
import { NamesService } from '@app/services/admin/names.service';
@Component({
    selector: 'app-player-names-options',
    templateUrl: './player-names-options.component.html',
    styleUrls: ['./player-names-options.component.scss'],
})
export class PlayerNamesOptionsComponent implements OnInit {
    name: string = '';
    isAdvanced: boolean = false;
    error: boolean = false;
    constructor(public nameService: NamesService) {}

    async ngOnInit() {
        this.name = '';
        this.isAdvanced = false;
        this.error = false;
        await this.nameService.fetchNames();
    }
    async addName() {
        await this.nameService.addName(this.name, this.isAdvanced);
    }
    validateName(): boolean {
        console.log('form ', this.name, 'isAdvanced: ', this.isAdvanced, 'Error: ', this.error);
        this.error = this.nameService.validateFormat(this.name);
        return this.error;
    }
}
