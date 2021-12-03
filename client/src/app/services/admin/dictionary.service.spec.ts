import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { RESPONSE_DELAY } from '@app/constants/url';
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

        service.getAllDictionaries().then((dictionaries) => {
            expect(dictionaries).withContext('should receive dictionaries').toEqual(response);
            expect(service.listDictionaries).toEqual(response);
        });

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

    it('fetchDictionary should get the dictionary from the server', async () => {
        const response: Dictionary = { title: 'first dictionary', description: 'the first dictionary for test purpose', words: ['papa', 'maman'] };

        service.fetchDictionary('first dictionary').subscribe((dictionary) => {
            expect(dictionary).withContext('should receive dictionaries').toEqual(response);
        });

        // getAllDictionaries should make only one request to 'GET' the dictionaries
        const req = httpTestingController.expectOne(service.url + '/getDictionary/' + 'first dictionary');
        expect(req.request.method).toEqual('GET');

        // The server should send the dictionaries after the 'GET'
        const expectedResponse = new HttpResponse({ body: response });
        req.event(expectedResponse);
    });

    it('emitToSnackBar should send snackBarSignal', async () => {
        const message = { message: 'test', action: 'test action' };

        // eslint-disable-next-line dot-notation
        service['emitToSnackBar']('test', 'test action');

        service.snackBarSignal.subscribe((mess) => {
            expect(mess).toEqual(message);
        });
    });
    describe('isNewDictionaryHasSameTitleAsAnother', () => {
        it('should return false if the name is unique', () => {
            service.listDictionaries = [{ title: 'a name', description: 'a description' }];
            service.titleAndDescriptionOfDictionary = { title: 'an other name', description: 'adescription' };
            const result = service.isNewDictionaryHasSameTitleAsAnother();
            expect(result).toEqual(false);
        });
        it('should return true if the name is not unique', () => {
            const notUniqueName = 'Not unique';
            service.listDictionaries = [{ title: notUniqueName, description: 'a description' }];
            service.titleAndDescriptionOfDictionary = { title: notUniqueName, description: 'adescription' };
            const result = service.isNewDictionaryHasSameTitleAsAnother();
            expect(result).toEqual(true);
        });
    });
    describe('reset', () => {
        it('should reset', (done) => {
            const getDictSpy = spyOn(service, 'getAllDictionaries');
            service.reset();
            const req = httpTestingController.expectOne(service.url + '/reset');
            expect(req.request.method).toEqual('GET');

            const serverResponse = new HttpResponse({ body: 'succes' });
            req.event(serverResponse);
            setTimeout(() => {
                expect(getDictSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
    });
    describe('download', () => {
        it('shoud get the dictionary then call writeDict', () => {
            const writeSpy = spyOn(service, 'writeDict');
            const response: Dictionary = {
                title: 'first dictionary',
                description: 'the first dictionary for test purpose',
                words: ['papa', 'maman'],
            };
            service.download(response.title);

            // getAllDictionaries should make only one request to 'GET' the dictionaries
            const req = httpTestingController.expectOne(service.url + '/getDictionary/' + 'first dictionary');
            expect(req.request.method).toEqual('GET');

            // The server should send the dictionaries after the 'GET'
            const expectedResponse = new HttpResponse({ body: response });
            req.event(expectedResponse);

            expect(writeSpy).toHaveBeenCalled();
        });
        it('writeFile should return status', () => {
            const response: Dictionary = {
                title: 'first dictionary',
                description: 'the first dictionary for test purpose',
                words: ['papa', 'maman'],
            };
            expect(service.writeDict(response)).toEqual('success');
        });
    });
    describe('assignDictionary', () => {
        it('should assign the dictonaries', () => {
            const dictionaries: TitleDescriptionOfDictionary[] = [
                { title: 'first dictionary', description: 'the first dictionary for test purpose' },
                { title: 'second dictionary', description: 'the second dictionary for test purpose' },
            ];
            service.listDictionaries = [];
            service.assignDictionary(dictionaries);
            expect(service.listDictionaries).toEqual(dictionaries);
        });
    });
    describe('upload', () => {
        it('should upload to the server', (done) => {
            const getSpy = spyOn(service, 'getAllDictionaries');

            const fileToUpload = new File(['allo'], 'file.json');
            service.upload(fileToUpload);

            const req = httpTestingController.expectOne(service.url + '/addNewDictionary');
            expect(req.request.method).toEqual('POST');
            const expectedResponse = new HttpResponse({ body: { isuploaded: true, message: 'a message' } });
            req.event(expectedResponse);

            setTimeout(() => {
                expect(getSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
        it('should thould amit a problem to snackBar when response is an error', (done) => {
            // emit to snackbar is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getSpy = spyOn<any>(service, 'emitToSnackBar');

            const fileToUpload = new File(['allo'], 'file.json');
            service.upload(fileToUpload);

            const req = httpTestingController.expectOne(service.url + '/addNewDictionary');
            expect(req.request.method).toEqual('POST');
            const expectedResponse = new ErrorEvent('an error');
            req.error(expectedResponse);

            setTimeout(() => {
                expect(getSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
    });
    describe('selectDictionary', () => {
        it('sould say a file is invalid if not provides in a dictionary JSON format', async () => {
            const uploadSpy = spyOn(service, 'upload');
            uploadSpy.and.callFake(async () => undefined);
            spyOn(service, 'isNewDictionaryHasSameTitleAsAnother').and.callFake(() => false);
            const dict = {
                title: 'dico test',
                description: 'un dico de test',
            };
            const invalidFile = new File([JSON.stringify(dict)], 'file.json');

            service.validationMessage.isValid = false;
            await service.selectDictionary(invalidFile);

            expect(service.validationMessage.isValid).toEqual(false);
        });
    });
});
