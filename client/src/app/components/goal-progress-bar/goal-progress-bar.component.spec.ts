import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoalProgressBarComponent } from './goal-progress-bar.component';

describe('GoalProgressBarComponent', () => {
    let component: GoalProgressBarComponent;
    let fixture: ComponentFixture<GoalProgressBarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GoalProgressBarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GoalProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
