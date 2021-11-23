import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NamesService } from './names.service';
const RESPONSE_DELAY = 1000;
fdescribe('NamesService', () => {
    let service: NamesService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        service = TestBed.inject(NamesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });
    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('fetchNames', () => {
        it('should fetch names from server', (done) => {
            const assignNamesSpy = spyOn(service, 'assignNames');
            service.fetchNames();
            const req = httpTestingController.expectOne(service.urlString);
            expect(req.request.method).toEqual('GET');

            const expectedResponse = new HttpResponse({ body: 'names' });
            console.log(expectedResponse);
            req.event(expectedResponse);

            setTimeout(() => {
                expect(assignNamesSpy).toHaveBeenCalled();
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
});
