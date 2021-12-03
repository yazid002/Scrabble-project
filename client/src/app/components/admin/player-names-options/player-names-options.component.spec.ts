import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { UserSettingsService } from '@app/services/user-settings.service';
import { PlayerNamesOptionsComponent } from './player-names-options.component';

describe('PlayerNamesOptionsComponent', () => {
    let component: PlayerNamesOptionsComponent;
    let fixture: ComponentFixture<PlayerNamesOptionsComponent>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(async () => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
        userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };
        await TestBed.configureTestingModule({
            declarations: [PlayerNamesOptionsComponent],
            imports: [FormsModule, AppMaterialModule, HttpClientTestingModule, AppMaterialModule, NoopAnimationsModule, BrowserAnimationsModule],
            providers: [{ provide: UserSettingsService, useValue: userSettingsServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerNamesOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
