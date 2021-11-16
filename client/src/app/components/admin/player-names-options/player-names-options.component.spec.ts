import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerNamesOptionsComponent } from './player-names-options.component';

describe('PlayerNamesOptionsComponent', () => {
  let component: PlayerNamesOptionsComponent;
  let fixture: ComponentFixture<PlayerNamesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerNamesOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNamesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
