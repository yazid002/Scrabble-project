import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ReserveService } from '@app/services/reserve.service';
import { TimerService } from '@app/services/timer.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { GameOverviewComponent } from './game-overview.component';

describe('GameOverviewComponent', () => {
    let component: GameOverviewComponent;
    let fixture: ComponentFixture<GameOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameOverviewComponent],
            imports: [MatCardModule, HttpClientModule],
            providers: [UserSettingsService, ReserveService, TimerService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should let settings unchanged when it cannot find it in the userSettingsService', () => {
        let undefinedOption: undefined;

        const INITIAL_VALUE = 'Une valeur sans importance';

        component.computerLevel = INITIAL_VALUE;
        // Car scrollDown est privée
        // eslint-disable-next-line dot-notation
        component['assignValues'](undefinedOption, undefinedOption, undefinedOption, undefinedOption);
        expect(component.computerLevel).toEqual(INITIAL_VALUE);
    });
});
