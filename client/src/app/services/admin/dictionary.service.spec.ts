import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/title-description-of-dictionary.model';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
    let service: DictionaryService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(DictionaryService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('getAllDictionaries should get all available dictionaries from the server', async () => {
        const response: TitleDescriptionOfDictionary[] = [
            { title: 'first dictionary', description: 'the first dictionary for test purpose' },
            { title: 'second dictionary', description: 'the second dictionary for test purpose' },
        ];

        service.getAllDictionaries().then((dictionaries) => expect(dictionaries).withContext('should receive dictionaries').toEqual(response));

        // getAllDictionaries should make only one request to 'GET' the dictionaries
        const req = httpTestingController.expectOne(service.url + '/findAll');
        expect(req.request.method).toEqual('GET');

        // The server should send the dictionaries after the 'GET'
        const expectedResponse = new HttpResponse({ body: response });
        req.event(expectedResponse);
    });

    it('deleteDictionary should delete the provided dictionary and refresh the list of dictionaries', async () => {
        const dictionaries: TitleDescriptionOfDictionary[] = [
            { title: 'first dictionary', description: 'the first dictionary for test purpose' },
            { title: 'second dictionary', description: 'the second dictionary for test purpose' },
        ];

        const response = 'file removed successfully';

        const getAllDictionariesSpy = spyOn(service, 'getAllDictionaries').and.callFake(async () => {
            return Promise.resolve(dictionaries);
        });

        service.deleteDictionary('first dictionary').then((rep) => {
            expect(rep).withContext('should delete the provided dictionary');
            expect(getAllDictionariesSpy).toHaveBeenCalled();
        });

        // getAllDictionaries should make only one request to 'DELETE' the dictionary
        const req = httpTestingController.expectOne(service.url + '/delete/' + 'first dictionary');
        expect(req.request.method).toEqual('DELETE');

        // The server should send the response after the 'DELETE'
        const expectedResponse = new HttpResponse({ body: response });
        req.event(expectedResponse);
    });
});
