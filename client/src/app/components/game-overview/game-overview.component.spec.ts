import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { UserSettingsService } from '@app/services/user-settings.service';
import { GameOverviewComponent } from './game-overview.component';

describe('GameOverviewComponent', () => {
    let component: GameOverviewComponent;
    let fixture: ComponentFixture<GameOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameOverviewComponent],
            imports: [MatCardModule],
            providers: [UserSettingsService],
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
});
