import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { of } from 'rxjs';
import { DictionaryService } from './admin/dictionary.service';
import { UserSettingsService } from './user-settings.service';

const COMPUTER_NAMES: string[] = ['Ordi Illetré', 'Dictionnaire en Personne', 'Word Master'];

describe('UserSettingsService', () => {
    let service: UserSettingsService;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;

    beforeEach(() => {
        const dictionary: Dictionary = { title: 'first dictionary', description: 'the first dictionary for test purpose', words: ['papa', 'maman'] };

        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['fetchDictionary', 'getAllDictionaries']);
        dictionaryServiceSpy.fetchDictionary.and.returnValue(of(dictionary));
        dictionaryServiceSpy.getAllDictionaries.and.returnValue(Promise.resolve([{ title: dictionary.title, description: dictionary.description }]));
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

    it('getComputerName should return the default computer name if there is one and it is not the same as the real user name', () => {
        const defaultName = 'computer';
        service.computerName = defaultName;

        const result = service.getComputerName();

        expect(result).toEqual(defaultName);
    });

    it('getComputerName should return a random name in COMPUTER_NAMES if the name is undefined and the user name is different', () => {
        const defaultName = undefined as unknown as string;
        service.computerName = defaultName;
        service.nameOption.userChoice = 'user';

        const result = service.getComputerName();

        expect(COMPUTER_NAMES).toContain(result);
    });

    it('getComputerName should return a random name in COMPUTER_NAMES if the name is defined but the user name is the same', () => {
        service.computerName = 'user';
        service.nameOption.userChoice = 'user';

        const result = service.getComputerName();

        expect(COMPUTER_NAMES).toContain(result);
        expect(result).not.toEqual('user');
    });

    it('getComputerName should return a random name in COMPUTER_NAMES if the name is undefined and the user name is the same', () => {
        const undefinedName = undefined as unknown as string;
        service.computerName = undefinedName;
        service.nameOption.userChoice = undefinedName;

        const result = service.getComputerName();

        expect(COMPUTER_NAMES).toContain(result);
        expect(result).not.toEqual(undefinedName);
    });

    it('getSettings should return the service settings (mode and timer)', () => {
        const expectedResult = { timer: '20', mode: 'classic' };
        service.settings.mode.currentChoiceKey = expectedResult.mode;
        service.settings.timer.currentChoiceKey = expectedResult.timer;

        const result = service.getSettings();

        expect(result).toEqual(expectedResult);
    });
});
