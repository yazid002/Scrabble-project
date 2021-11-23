import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDictionaryComponent } from './form-dictionary.component';

describe('FormDictionaryComponent', () => {
  let component: FormDictionaryComponent;
  let fixture: ComponentFixture<FormDictionaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDictionaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
