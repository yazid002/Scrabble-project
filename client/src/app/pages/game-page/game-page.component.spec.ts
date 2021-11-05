import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { GameOverviewComponent } from '@app/components/game-overview/game-overview.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { GridService } from '@app/services/grid.service';
import { of } from 'rxjs';
import { GamePageComponent } from './game-page.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    beforeEach(async () => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['increaseTileSize', 'decreaseTileSize', 'drawGrid', 'randomizeBonus']);

        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.gridContext = ctxStub;
        gridServiceSpy.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        gridServiceSpy.pointStyle = { color: 'NavajoWhite', font: '10px serif' };

        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, ChatboxComponent, GameOverviewComponent],
            imports: [
                MatInputModule,
                FormsModule,
                MatIconModule,
                BrowserAnimationsModule,
                MatCardModule,
                MatDialogModule,
                MatButtonModule,
                AppRoutingModule,
                RouterModule,
            ],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('increaseSize should call increaseSize of gridService', () => {
        component.increaseSize();
        expect(gridServiceSpy.increaseTileSize).toHaveBeenCalled();
    });

    it('decreaseSize should call decreaseSize of gridService', () => {
        component.decreaseSize();
        expect(gridServiceSpy.decreaseTileSize).toHaveBeenCalled();
    });
});
