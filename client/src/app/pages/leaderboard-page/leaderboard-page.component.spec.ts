import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { LeaderboardService } from '@app/services/leaderboard.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { LeaderboardPageComponent } from './leaderboard-page.component';

describe('LeaderboardPageComponent', () => {
    let component: LeaderboardPageComponent;
    let fixture: ComponentFixture<LeaderboardPageComponent>;
    let learderboardServiceSpy: jasmine.SpyObj<LeaderboardService>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;
    beforeEach(async () => {
        learderboardServiceSpy = jasmine.createSpyObj('LeaderboardService', ['fetchClassic', 'fetchLog2990']);
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        learderboardServiceSpy.leaderboardClassic = [
            { name: 'a name', score: 199, mode: 'classic' },
            { name: 'another name', score: 5, mode: 'classic' },
        ];
        learderboardServiceSpy.leaderboardMode2990 = [
            { name: 'a name', score: 199, mode: 'log2990' },
            { name: 'another name', score: 5, mode: 'log2990' },
        ];
        await TestBed.configureTestingModule({
            providers: [
                { provide: LeaderboardService, useValue: learderboardServiceSpy },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
            ],
            declarations: [LeaderboardPageComponent],
            imports: [FormsModule, AppMaterialModule, HttpClientTestingModule, RouterTestingModule],
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
    it('completeGoalSound should play an audio', () => {
        soundManagerServiceSpy.playClickOnButtonAudio.and.returnValue(void '');
        component.playClickOnButtonAudio();
        expect(soundManagerServiceSpy.playClickOnButtonAudio).toHaveBeenCalled();
    });
});
