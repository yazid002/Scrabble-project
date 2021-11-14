import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpponentQuitDialogComponent } from './opponent-quit-dialog.component';

describe('OpponentQuitDialogComponent', () => {
  let component: OpponentQuitDialogComponent;
  let fixture: ComponentFixture<OpponentQuitDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpponentQuitDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpponentQuitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
