/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { DictionaryOptionsComponent } from '@app/components/admin/dictionary-options/dictionary-options.component';
import { PlayerNamesOptionsComponent } from '@app/components/admin/player-names-options/player-names-options.component';
import { FormDictionaryComponent } from './form-dictionary/form-dictionary.component';
// import { DictionaryOptionsComponent } from '@app/components/admin/dictionary-options/dictionary-options.component';
export type Options = 'dictionary' | 'names' | 'none';
@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    constructor(public dialog: MatDialog) {}
    @ViewChild(DictionaryOptionsComponent) dictionaryOptionsComponent: DictionaryOptionsComponent;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild(PlayerNamesOptionsComponent) playerNamesOptionsComponent: PlayerNamesOptionsComponent;

    afficher() {
        console.log('-----> fonction afficher la liste des dictionnaires');
    }

    getForm() {
        this.dialog.open(FormDictionaryComponent);
    }
}
