import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { LeaderboardService } from '@app/services/leaderboard.service';
import { LeaderboardPageComponent } from './leaderboard-page.component';

describe('LeaderboardPageComponent', () => {
    let component: LeaderboardPageComponent;
    let fixture: ComponentFixture<LeaderboardPageComponent>;
    let learderboardServiceSpy: jasmine.SpyObj<LeaderboardService>;
    beforeEach(async () => {
        learderboardServiceSpy = jasmine.createSpyObj('LeaderboardService', ['fetchClassic', 'fetchLog2990']);
        learderboardServiceSpy.leaderboardClassic = [
            { name: 'a name', score: 199, mode: 'classic' },
            { name: 'another name', score: 5, mode: 'classic' },
        ];
        learderboardServiceSpy.leaderboardMode2990 = [
            { name: 'a name', score: 199, mode: 'log2990' },
            { name: 'another name', score: 5, mode: 'log2990' },
        ];
        await TestBed.configureTestingModule({
            providers: [{ provide: LeaderboardService, useValue: learderboardServiceSpy }],
            declarations: [LeaderboardPageComponent],
            imports: [HttpClientTestingModule, RouterModule],
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
