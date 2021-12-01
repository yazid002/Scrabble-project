import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { DictionaryOptionsComponent } from '@app/components/admin/dictionary-options/dictionary-options.component';
import { PlayerNamesOptionsComponent } from '@app/components/admin/player-names-options/player-names-options.component';
// import { DictionaryOptionsComponent } from '@app/components/admin/dictionary-options/dictionary-options.component';
export type Options = 'dictionary' | 'names' | 'none';
@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {

    @ViewChild(DictionaryOptionsComponent) dictionaryOptionsComponent: DictionaryOptionsComponent;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild(PlayerNamesOptionsComponent) playerNamesOptionsComponent: PlayerNamesOptionsComponent;

}
