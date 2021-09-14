import { TestBed } from '@angular/core/testing';
import { LettreService } from './serve.service';

describe('ServeService', () => {
    let service: LettreService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LettreService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
