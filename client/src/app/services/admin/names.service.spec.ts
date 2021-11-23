import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NamesService } from './names.service';

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
        it('should fetch names from server', () => {
            service.fetchNames();
            const req = httpTestingController.expectOne(service.urlString);
            expect(req.request.method).toEqual('GET');

            const names = [
                { name: 'Ordi Illetré', default: true, isAdvanced: false },
                { name: 'Étudiant de la maternelle', default: true, isAdvanced: false },
                { name: 'Analphabète', default: true, isAdvanced: false },
                { name: 'Dictionnaire en Personne', default: true, isAdvanced: true },
                { name: 'Word Master', default: true, isAdvanced: true },
                { name: 'Étudiant en littérature', default: true, isAdvanced: true },
            ];
            const expectedResponse = new HttpResponse({ body: names });
            req.event(expectedResponse);
        });
    });
    describe('addName', () => {
        it('should send the name to the server', () => {
            const nameToAdd = { name: 'a name', default: false, isAdvanced: false };
            service.addName(nameToAdd.name, nameToAdd.isAdvanced);

            const req = httpTestingController.expectOne(service.urlString + 'add');
            expect(req.request.method).toEqual('POST');
        });
    });
    describe('reset', () => {
        it('call reset from server', () => {
            service.reset();

            const req = httpTestingController.expectOne(service.urlString + 'reset');
            expect(req.request.method).toEqual('GET');
        });
    });
    describe('delete', () => {
        it('should send the name to the server', () => {
            const nameToAdd = { name: 'a name', default: false, isAdvanced: false };
            service.delete(nameToAdd);

            const req = httpTestingController.expectOne(service.urlString + 'delete');
            expect(req.request.method).toEqual('POST');
        });
    });
});
