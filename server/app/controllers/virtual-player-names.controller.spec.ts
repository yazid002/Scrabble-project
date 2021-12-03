import { Application } from '@app/app';
import { NameProperties } from '@app/classes/name-properties';
import { VirtualPlayerNamesService } from '@app/services/virtual-player-names.service';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;

describe('VirtualPlayerNamesController', () => {
    let service: SinonStubbedInstance<VirtualPlayerNamesService>;
    let expressApp: Express.Application;

    const players: NameProperties[] = [
        { name: 'nom1', isAdvanced: false, default: true },
        { name: 'nom1', isAdvanced: false, default: true },
        { name: 'nom1', isAdvanced: false, default: true },
        { name: 'nom1', isAdvanced: false, default: true },
        { name: 'nom1', isAdvanced: false, default: true },
        { name: 'nom1', isAdvanced: false, default: true },
    ];
    beforeEach(async () => {
        service = createStubInstance(VirtualPlayerNamesService);
        service.getNames.resolves(players);
        service.addName.resolves(undefined);
        service.reset.resolves(undefined);
        service.delete.resolves(undefined);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['virtualPlayerNamesController'], 'virtualPlayerNamesService', { value: service, writable: true });
        expressApp = app.app;
    });

    it('/ should return a list of names', async () => {
        return supertest(expressApp)
            .get('/api/virtual/')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(players);
            });
    });
    it('/add should return status OK', async () => {
        return supertest(expressApp).post('/api/virtual/add').expect(HTTP_STATUS_OK);
    });
    it('/reset should return status OK', async () => {
        return supertest(expressApp).get('/api/virtual/reset').expect(HTTP_STATUS_OK);
    });
    it('/delete should return status OK', async () => {
        return supertest(expressApp).post('/api/virtual/delete').expect(HTTP_STATUS_OK);
    });
});
