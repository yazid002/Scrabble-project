import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { DictionaryService } from '@app/services/admin/dictionary.service';
import { NamesService } from '@app/services/admin/names.service';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    // let nameServiceSpy: jasmine.SpyObj<NamesService>;
    // let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;

    beforeEach(async () => {
        // nameServiceSpy = jasmine.createSpyObj('NamesService', ['reset']);
        // dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['reset']);
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent],
            imports: [FormsModule, AppMaterialModule, HttpClientTestingModule, AppMaterialModule, RouterTestingModule],
            // providers: [
            //     { provide: DictionaryService, useValue: dictionaryServiceSpy },
            //     { provide: NamesService, useValue: nameServiceSpy },
            // ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call reset from the nameService and dictionaryService', () => {
        component.reset();
        expect(dictionaryServiceSpy.reset).toHaveBeenCalled();
        expect(nameServiceSpy.reset).toHaveBeenCalled();
    });
});
