import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { of } from 'rxjs';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}
describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;

    beforeEach(async () => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        await TestBed.configureTestingModule({
            imports: [MatDialogModule, MatButtonModule, AppRoutingModule, RouterModule],
            declarations: [MainPageComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open a MatDialog box asking for the number of players', () => {
        // eslint-disable-next-line -- matDialog is private and we need access for the test
        const spy = spyOn(component['matDialog'], 'open');
        component.chooseMode('classic');
        expect(spy).toHaveBeenCalled();
    });
});
