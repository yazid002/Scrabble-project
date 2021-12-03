import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Dictionary } from '@app/classes/dictionary';
import { AppMaterialModule } from '@app/modules/material.module';
import { DictionaryService } from '@app/services/admin/dictionary.service';
import { BehaviorSubject, of } from 'rxjs';
import { DictionaryOptionsComponent } from './dictionary-options.component';

describe('DictionaryOptionsComponent', () => {
    let component: DictionaryOptionsComponent;
    let fixture: ComponentFixture<DictionaryOptionsComponent>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
    const message = { message: 'test', action: 'Dismiss' };

    beforeEach(async () => {
        const dictionary: Dictionary = { title: 'first dictionary', description: 'the first dictionary for test purpose', words: ['papa', 'maman'] };
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['fetchDictionary', 'getAllDictionaries', 'selectDictionary']);
        dictionaryServiceSpy.fetchDictionary.and.returnValue(of(dictionary));
        dictionaryServiceSpy.getAllDictionaries.and.returnValue(Promise.resolve([{ title: dictionary.title, description: dictionary.description }]));

        dictionaryServiceSpy.snackBarSignal = new BehaviorSubject<{ message: string; action: string }>(message);
        await TestBed.configureTestingModule({
            declarations: [DictionaryOptionsComponent],
            imports: [FormsModule, AppMaterialModule, HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule],
            providers: [{ provide: DictionaryService, useValue: dictionaryServiceSpy }, MatSnackBar],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get all dictionaries at initialization', () => {
        expect(dictionaryServiceSpy.getAllDictionaries).toHaveBeenCalled();
    });

    it('should call openSnackBar', () => {
        const openSnackBarSpy = spyOn(component, 'openSnackBar').and.returnValue(void '');
        dictionaryServiceSpy.snackBarSignal.next(message);
        fixture.detectChanges();

        expect(openSnackBarSpy).toHaveBeenCalled();
    });

    it('selectDictionary should call dictionary service selectDictionary when a selected event is received', async () => {
        const file: File = {
            name: 'a file test',
        } as File;

        // Disable the any lint filer because it is hard to know the type of an event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const event: any = {
            target: {
                files: [file],
            },
        };

        const expectedCallTimes = 1;

        await component.selectDictionary(event);

        expect(dictionaryServiceSpy.selectDictionary).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('selectDictionary should not call dictionary service selectDictionary when there is no file selected', async () => {
        // Disable the any lint filer because it is hard to know the type of an event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const event: any = {
            target: {
                files: [],
            },
        };

        const expectedCallTimes = 1;

        await component.selectDictionary(event);

        expect(dictionaryServiceSpy.selectDictionary).not.toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('openSnackBar should call dictionary service selectDictionary when a selected event is received', () => {
        const snackBarRef: MatSnackBarRef<TextOnlySnackBar> = {
            onAction: () => {
                return of(void '');
            },

            dismiss: () => void '',
        } as MatSnackBarRef<TextOnlySnackBar>;

        // snackBar is private
        /* eslint-disable dot-notation */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const openSpy = spyOn<any>(component['snackBar'], 'open').and.returnValue(snackBarRef);

        const dismissSpy = spyOn(snackBarRef, 'dismiss').and.callThrough();

        dictionaryServiceSpy.snackBarSignal.next(message);
        fixture.detectChanges();

        expect(openSpy).toHaveBeenCalled();
        expect(dismissSpy).toHaveBeenCalled();
    });
});
