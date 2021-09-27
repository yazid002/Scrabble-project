import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, MatDialogModule, BrowserAnimationsModule],
            declarations: [MainPageComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
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
