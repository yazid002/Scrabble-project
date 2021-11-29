import { NameProperties } from '@app/classes/name-properties';
import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseService } from './database.service';
import { VirtualPlayerNamesService } from './virtual-player-names.service';

describe('Virtual players names service', () => {
    let service: VirtualPlayerNamesService;
    let databaseService: DatabaseService;
    let mongoServer: MongoMemoryServer;
    let mongoUri: string;
    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
        mongoUri = await mongoServer.getUri();
        databaseService = new DatabaseService();
        await databaseService.start(mongoUri);
        service = new VirtualPlayerNamesService(databaseService);
    });
    // afterEach(async () => {
    //     service.reset();
    // })

    // it('Should only add a name if name is not already in list', async () => {
    //     const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };
    //     service.addName(name);
    // });
    // it('should have only the default names after calling reset', () => {
    //     const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };
    //     service.addName(name);
    //     service.reset();
    // });
    describe('getNames', () => {
        it('should return an array of NameProperties', async () => {
            const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };

            const nameArray = await service.getNames();
            let isNamePropertiesArray = false;
            try {
                nameArray.push(name);
                isNamePropertiesArray = true;
            } catch {
                isNamePropertiesArray = false;
            }
            expect(isNamePropertiesArray).to.deep.equal(true);
        });
    });
    describe('add and delete', () => {
        it('should delete name if it exists', async () => {
            // add a name that is not in the array
            const initArray = await service.getNames();
            const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };
            await service.addName(name);
            const afterAddArray = await service.getNames();
            expect(initArray.length).lessThan(afterAddArray.length);

            // add a name that is already in the array
            await service.addName(name);
            const afterSecondAddArray = await service.getNames();
            expect(afterSecondAddArray.length).to.deep.equal(afterAddArray.length);

            // delete the name and see if it disapeared
            await service.delete(name);
            const afterDeleteArray = await service.getNames();
            expect(afterDeleteArray.length).to.deep.equal(initArray.length);
        });
    });
    describe('reset', () => {
        it('should reset the names array to its default value when called', async () => {
            const initArray = await service.getNames();
            const namesToAdd: NameProperties[] = [
                { name: 'a', isAdvanced: true, default: false },
                { name: 'b', isAdvanced: true, default: false },
                { name: 'c', isAdvanced: true, default: false },
                { name: 'd', isAdvanced: true, default: false },
                { name: 'e', isAdvanced: false, default: false },
                { name: 'f', isAdvanced: false, default: false },
                { name: 'g', isAdvanced: false, default: false },
                { name: 'h', isAdvanced: false, default: false },
            ];
            for (const name of namesToAdd) {
                await service.addName(name);
            }
            await service.reset();
            const afterResetArray = await service.getNames();
            expect(afterResetArray).to.deep.equal(initArray);
        });
    });
});
