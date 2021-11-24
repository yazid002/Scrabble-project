import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaderboardService } from '@app/services/leaderboard.service';
import { LeaderboardPageComponent } from './leaderboard-page.component';

describe('LeaderboardPageComponent', () => {
    let component: LeaderboardPageComponent;
    let fixture: ComponentFixture<LeaderboardPageComponent>;
    let learderboardServiceSpy: jasmine.SpyObj<LeaderboardService>;
    beforeEach(async () => {
        learderboardServiceSpy = jasmine.createSpyObj('LeaderboardService', ['sort', 'deletePlayer', 'addPlayer', 'getAllClassicPlayer']);
        learderboardServiceSpy.leaderboardClassic = [{ id: 'an id', name: 'a name', score: 100 }];
        learderboardServiceSpy.leaderboardMode2990 = [{ id: 'an id', name: 'a name', score: 100 }];
        await TestBed.configureTestingModule({
            providers: [{ provide: LeaderboardService, useValue: learderboardServiceSpy }],
            declarations: [LeaderboardPageComponent],
            imports: [HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaderboardPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
