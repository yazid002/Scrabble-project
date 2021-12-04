import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RESPONSE_DELAY, URL } from '@app/constants/url';
import { NamesService } from './names.service';
describe('NamesService', () => {
    let service: NamesService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule, NoopAnimationsModule] });
        service = TestBed.inject(NamesService);
        httpTestingController = TestBed.inject(HttpTestingController);
        service.urlString = URL.dev + '/api/virtual/';
    });
    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('fetchNames', () => {
        it('should fetch names from server', async () => {
            const assignNamesSpy = spyOn(service, 'assignNames');
            service.fetchNames().then(() => {
                expect(assignNamesSpy).toHaveBeenCalled();
            });
            const req = httpTestingController.expectOne(service.urlString);
            expect(req.request.method).toEqual('GET');

            const expectedResponse = new HttpResponse({ body: 'names' });
            req.event(expectedResponse);
        });
        it('should call handleError() if and error is returned', (done) => {
            // handleError is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handleErrorSpy = spyOn<any>(service, 'handleError');
            service.fetchNames();
            const req = httpTestingController.expectOne(service.urlString);
            expect(req.request.method).toEqual('GET');

            const expectedResponse = new ErrorEvent('allo');
            req.error(expectedResponse);

            setTimeout(() => {
                expect(handleErrorSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
        it('should assign names to right arrays', () => {
            const names = [
                { name: 'Ordi Illetré', default: true, isAdvanced: false },
                { name: 'Étudiant de la maternelle', default: true, isAdvanced: false },
                { name: 'Analphabète', default: true, isAdvanced: false },
                { name: 'Dictionnaire en Personne', default: true, isAdvanced: true },
                { name: 'Word Master', default: true, isAdvanced: true },
                { name: 'Étudiant en littérature', default: true, isAdvanced: true },
            ];
            // eslint-disable-next-line dot-notation
            service['assignNames'](names);
            expect(service.beginnerNames).toEqual(names.filter((item) => !item.isAdvanced));
            expect(service.advancedNames).toEqual(names.filter((item) => item.isAdvanced));
        });
    });
    describe('addName', () => {
        it('should send the name to the server', (done) => {
            const fetchSpy = spyOn(service, 'fetchNames');
            const nameToAdd = { name: 'a name', default: false, isAdvanced: false };
            service.addName(nameToAdd.name, nameToAdd.isAdvanced);

            const req = httpTestingController.expectOne(service.urlString + 'add');
            expect(req.request.method).toEqual('POST');
            const expectedResponse = new HttpResponse({ body: 'names' });
            req.event(expectedResponse);

            setTimeout(() => {
                expect(fetchSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
    });
    describe('reset', () => {
        it('call reset from server', (done) => {
            const fetchSpy = spyOn(service, 'fetchNames');
            service.reset();

            const req = httpTestingController.expectOne(service.urlString + 'reset');
            expect(req.request.method).toEqual('GET');
            const expectedResponse = new HttpResponse({ body: 'names' });
            req.event(expectedResponse);

            setTimeout(() => {
                expect(fetchSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
    });
    describe('delete', () => {
        it('should send the name to the server', (done) => {
            const fetchSpy = spyOn(service, 'fetchNames');
            const nameToAdd = { name: 'a name', default: false, isAdvanced: false };
            service.delete(nameToAdd);

            const req = httpTestingController.expectOne(service.urlString + 'delete');
            expect(req.request.method).toEqual('POST');
            const expectedResponse = new HttpResponse({ body: 'names' });
            req.event(expectedResponse);

            setTimeout(() => {
                expect(fetchSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
    });
    describe('getRandomName', () => {
        it('should return a string', async () => {
            spyOn(service, 'fetchNames').and.resolveTo(undefined);
            const result = await service.getRandomName('beginner');
            expect(service.beginnerNames.map((nameProp) => nameProp.name).includes(result)).toEqual(true);
        });
    });
    describe('handleError', () => {
        it('should setError to true', () => {
            service.error = false;
            // eslint-disable-next-line dot-notation
            service['handleError'](new HttpErrorResponse({ error: true }));
            expect(service.error).toEqual(true);
        });
    });
});
