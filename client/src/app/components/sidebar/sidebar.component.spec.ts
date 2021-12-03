// import { HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { RouterTestingModule } from '@angular/router/testing';
// import { GameOverviewComponent } from '@app/components/game-overview/game-overview.component';
// import { QuitConfirmationDialogComponent } from '@app/components/quit-confirmation-dialog/quit-confirmation-dialog.component';
// import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
// import { AppRoutingModule } from '@app/modules/app-routing.module';
// import { AppMaterialModule } from '@app/modules/material.module';
// import { of } from 'rxjs';

// class MatDialogMock {
//     open() {
//         return {
//             afterClosed: () => of({}),
//         };
//     }
// }
// describe('SidebarComponent', () => {
//     let component: SidebarComponent;
//     let fixture: ComponentFixture<SidebarComponent>;

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [
//                 FormsModule,
//                 AppMaterialModule,
//                 MatDialogModule,
//                 MatButtonModule,
//                 AppRoutingModule,
//                 RouterTestingModule,
//                 MatCardModule,
//                 HttpClientModule,
//             ],
//             declarations: [SidebarComponent, QuitConfirmationDialogComponent, GameOverviewComponent],
//             providers: [
//                 {
//                     provide: MatDialog,
//                     useClass: MatDialogMock,
//                 },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SidebarComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should open a MatDialog box on "openQuitConfirmationDialog"', () => {
//         // eslint-disable-next-line -- matDialog is private and we need access for the test
//         const spy = spyOn(component['matDialog'], 'open');
//         component.openQuitConfirmationDialog();
//         expect(spy).toHaveBeenCalled();
//     });
// });
