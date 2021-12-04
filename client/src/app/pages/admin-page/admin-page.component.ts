import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { DictionaryOptionsComponent } from '@app/components/admin/dictionary-options/dictionary-options.component';
import { PlayerNamesOptionsComponent } from '@app/components/admin/player-names-options/player-names-options.component';
import { DictionaryService } from '@app/services/admin/dictionary.service';
import { NamesService } from '@app/services/admin/names.service';
import { LeaderboardService } from '@app/services/leaderboard.service';

export type Options = 'dictionary' | 'names' | 'none';
@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
    @ViewChild(DictionaryOptionsComponent) dictionaryOptionsComponent: DictionaryOptionsComponent;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild(PlayerNamesOptionsComponent) playerNamesOptionsComponent: PlayerNamesOptionsComponent;

    constructor(public nameService: NamesService, public dictionaryService: DictionaryService, public leaderboardService: LeaderboardService) {}

    async ngOnInit() {
        await this.nameService.fetchNames();
    }
    reset() {
        this.nameService.reset();
        this.dictionaryService.reset();
    }
}
