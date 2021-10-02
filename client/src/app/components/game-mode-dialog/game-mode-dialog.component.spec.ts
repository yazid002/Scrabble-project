import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameModeDialogComponent } from './game-mode-dialog.component';

describe('GameModeDialogComponent', () => {
    let component: GameModeDialogComponent;
    let fixture: ComponentFixture<GameModeDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameModeDialogComponent],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
            imports: [BrowserAnimationsModule, MatRadioModule, MatCardModule, FormsModule, MatInputModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameModeDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
