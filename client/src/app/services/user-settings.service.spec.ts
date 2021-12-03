import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DictionaryService } from './admin/dictionary.service';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
    let service: UserSettingsService;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
    beforeEach(() => {
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['getAllDictionaries']);
        dictionaryServiceSpy.getAllDictionaries.and.resolveTo([{ title: 'a title', description: 'a description' }]);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: DictionaryService, useValue: dictionaryServiceSpy }],
        });
        service = TestBed.inject(UserSettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should return an empty response when a valid name is given', () => {
        const validName = 'Maxime';
        const expectedResponse: { error: boolean; errorMessage: string } = { error: false, errorMessage: '' };
        expect(service.validateName(validName)).toEqual(expectedResponse);
    });
    it('should return an object saying why a name is invalid when an invalid name is given', () => {
        const specialCaracterName = '±@£¢¤¬';
        const expectedResponse = { error: true, errorMessage: 'Caractères spéciaux intertits' };

        expect(service.validateName(specialCaracterName)).toEqual(expectedResponse);
    });
});
