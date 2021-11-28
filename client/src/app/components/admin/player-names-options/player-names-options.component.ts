import { Component, OnInit } from '@angular/core';
import { NamesService } from '@app/services/admin/names.service';
import { UserSettingsService } from '@app/services/user-settings.service';
@Component({
    selector: 'app-player-names-options',
    templateUrl: './player-names-options.component.html',
    styleUrls: ['./player-names-options.component.scss'],
})
export class PlayerNamesOptionsComponent implements OnInit {
    name: string = '';
    isAdvanced: boolean = false;
    error: boolean = false;
    errorMessage: string = '';
    constructor(public nameService: NamesService, private userSettingsService: UserSettingsService) {
    }

    async ngOnInit() {
        await this.nameService.fetchNames();
    }
    async addName() {
        await this.nameService.addName(this.name, this.isAdvanced);
    }
    validateName(): boolean {
        console.log('form ', this.name, 'isAdvanced: ', this.isAdvanced, 'Error: ', this.error);
        const result = this.userSettingsService.validateName(this.name);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
        return this.error;
    }
}
