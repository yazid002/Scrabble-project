import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
    let service: UserSettingsService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
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
