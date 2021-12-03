import { Leaderboard } from '@app/classes/leaderboard';
import { expect } from 'chai';
import { assert } from 'console';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import { DatabaseService } from './database.service';
import { LeaderboardService } from './leaderboard.service';

describe('leaderboard service', () => {
    let leaderboardService: LeaderboardService;
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let mongoUri: string;

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = await mongoServer.getUri();
        databaseService = new DatabaseService();
        await databaseService.start(mongoUri);
        leaderboardService = new LeaderboardService(databaseService);
    });

    describe('add and delete Classic', () => {
        it('should delete name if it exists', async () => {
            // add a player that is not in the array
            const initArray = await leaderboardService.getAllClassicPlayers();
            const player: Leaderboard = { name: 'TestPlayer1', score: 50, mode: 'Classic' };
            await leaderboardService.addClassicPlayer(player, leaderboardService);
            const afterAddArray = await leaderboardService.getAllClassicPlayers();
            expect(initArray.length).lessThan(afterAddArray.length);

            // delete the player and see if it disapeared
            await leaderboardService.deleteClassicPlayer('TestPlayer1', leaderboardService);
            const afterDeleteArray = await leaderboardService.getAllClassicPlayers();
            expect(afterDeleteArray.length).to.deep.equal(initArray.length);

            try {
                await leaderboardService.deleteClassicPlayer('TestPlayer10', leaderboardService);
            } catch {
                const after2ndDeleteArray = await leaderboardService.getAllClassicPlayers();
                expect(after2ndDeleteArray.length).to.deep.equal(afterDeleteArray.length);
            }
        });
    });

    describe('add and delete Mode2990', () => {
        it('should delete name if it exists', async () => {
            // add a player that is not in the array
            const initArray = await leaderboardService.getAll2990Players();
            const player: Leaderboard = { name: 'TestPlayer1', score: 50, mode: 'Classic' };
            await leaderboardService.add2990Player(player, leaderboardService);
            const afterAddArray = await leaderboardService.getAll2990Players();
            expect(initArray.length).lessThan(afterAddArray.length);

            // delete the player and see if it disapeared
            await leaderboardService.delete2990Player('TestPlayer1', leaderboardService);
            const afterDeleteArray = await leaderboardService.getAll2990Players();
            expect(afterDeleteArray.length).to.deep.equal(initArray.length);

            // delete the player and see if it disapeared
            try {
                await leaderboardService.delete2990Player('TestPlayer10', leaderboardService);
            } catch {
                const after2ndDeleteArray = await leaderboardService.getAll2990Players();
                expect(after2ndDeleteArray.length).to.deep.equal(afterDeleteArray.length);
            }
        });
    });

    describe('reset', () => {
        it('should reset the players array to its default value when called', async () => {
            const initArray = await leaderboardService.getAllClassicPlayers();
            let initArrayNames;
            for (const i of initArray) {
                initArrayNames = i.name;
            }

            const playersToAdd: Leaderboard[] = [
                { name: 'a', score: 1, mode: 'classic' },
                { name: 'b', score: 2, mode: 'classic' },
                { name: 'c', score: 3, mode: 'classic' },
                { name: 'd', score: 4, mode: 'classic' },
                { name: 'e', score: 5, mode: 'classic' },
            ];
            for (const name of playersToAdd) {
                await leaderboardService.addClassicPlayer(name, leaderboardService);
            }
            await leaderboardService.reset();
            const afterResetArray = await leaderboardService.getAllClassicPlayers();
            let afterResetArrayNames;
            for (const i of afterResetArray) {
                afterResetArrayNames = i.name;
            }

            expect(afterResetArrayNames).to.deep.equal(initArrayNames);
        });
    });

    it('endgame should call get, add and delete', async () => {
        const player: Leaderboard = { name: 'TestPlayer1', score: 50, mode: 'classic' };
        const getSpy = sinon.spy(leaderboardService, 'getAllClassicPlayers');
        const addSpy = sinon.spy(leaderboardService, 'addClassicPlayer');
        const deleteSpy = sinon.spy(leaderboardService, 'deleteClassicPlayer');
        leaderboardService.endGame(player);
        assert(getSpy.called);
        assert(addSpy.called);
        assert(deleteSpy.called);
    });

    it('endgame should call get, add and delete', async () => {
        const player: Leaderboard = { name: 'TestPlayer1', score: 0, mode: 'mode2990' };
        const getSpy = sinon.spy(leaderboardService, 'getAll2990Players');
        const addSpy = sinon.spy(leaderboardService, 'add2990Player');
        const deleteSpy = sinon.spy(leaderboardService, 'delete2990Player');
        leaderboardService.endGame(player);
        assert(getSpy.notCalled);
        assert(addSpy.notCalled);
        assert(deleteSpy.notCalled);
    });
});