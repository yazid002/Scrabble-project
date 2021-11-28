import { Application } from '@app/app';
import { Leaderboard } from '@app/classes/Leaderboard';
import { LeaderBoardService } from '@app/services/Leaderboard.service';
// import * as chai from 'chai';
import { expect } from 'chai';
// import * as spies from 'chai-spies';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

const HTTP_STATUS_OK = StatusCodes.OK;

describe('LeaderBoardController', () => {
    let service: SinonStubbedInstance<LeaderBoardService>;
    let expressApp: Express.Application;

    const log2990Board: Leaderboard[] = [
        { name: 'nom1', score: 14, mode: 'log2990' },
        { name: 'nom2', score: 15, mode: 'log2990' },
        { name: 'nom3', score: 16, mode: 'log2990' },
    ];
    const classicBoard: Leaderboard[] = [
        { name: 'nom4', score: 14, mode: 'classic' },
        { name: 'nom5', score: 15, mode: 'classic' },
        { name: 'nom6', score: 16, mode: 'classic' },
    ];
    beforeEach(async () => {
        service = createStubInstance(LeaderBoardService);
        service.getAllClassicPlayers.resolves(classicBoard);
        service.getAll2990Players.resolves(log2990Board);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['leaderBoardController'], 'leaderboardService', { value: service, writable: true });
        expressApp = app.app;
    });

    it('/ should return a list of names from mode log2990 mode', async () => {
        return supertest(expressApp)
            .get('/leaderboard/')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(log2990Board);
            });
    });
    it('/ClassicLeaderboard should return a list of names from classic mode', async () => {
        return supertest(expressApp)
            .get('/leaderboard/ClassicLeaderboard')
            .expect(HTTP_STATUS_OK)
            .then((response) => {
                expect(response.body).to.deep.equal(classicBoard);
            });
    });
});
