import { Component, OnInit } from '@angular/core';
import { NamesService } from '@app/services/admin/names.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    constructor(private namesService: NamesService) {}
    async ngOnInit() {
        this.namesService.fetchNames();
    }
}
