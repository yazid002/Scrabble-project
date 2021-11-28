import { Application } from '@app/app';
import { VirtualPlayerNamesService } from '@app/services/virtual-player-names.service';
import * as chai from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;
interface NameProperties {
    name: string;
    default: boolean;
    isAdvanced: boolean;
}
describe('VirtualPlayerNamesController', () => {
    let service: SinonStubbedInstance<VirtualPlayerNamesService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        service = createStubInstance(VirtualPlayerNamesService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['VirtualPlayerNamesController'], 'virtualPlayerNamesService', { value: service, writable: true });
        expressApp = app.app;
    });

    it('/ should return a list of names', async () => {
        const expectedMessage: NameProperties[] = [
            { name: 'Ordi Illetré', default: true, isAdvanced: false },
            { name: 'Étudiant de la maternelle', default: true, isAdvanced: false },
            { name: 'Analphabète', default: true, isAdvanced: false },
            { name: 'Dictionnaire en Personne', default: true, isAdvanced: true },
            { name: 'Word Master', default: true, isAdvanced: true },
            { name: 'Étudiant en littérature', default: true, isAdvanced: true },
        ];

        return supertest(expressApp)
            .get('/api/virtual/')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal(expectedMessage);
            });
    });
});
