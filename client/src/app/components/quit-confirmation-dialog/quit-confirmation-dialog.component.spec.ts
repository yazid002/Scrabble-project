import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuitConfirmationDialogComponent } from './quit-confirmation-dialog.component';

describe('QuitConfirmationDialogComponent', () => {
  let component: QuitConfirmationDialogComponent;
  let fixture: ComponentFixture<QuitConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuitConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuitConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
