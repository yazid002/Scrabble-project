import { DatabaseService } from './database.service';
import { VirtualPlayerNamesService } from './virtual-player-names.service';

interface NameProperties {
    name: string;
    default: boolean;
    isAdvanced: boolean;
}
describe('Example service', () => {
    let service: VirtualPlayerNamesService;
    let databaseService: DatabaseService;
    beforeEach(async () => {
        databaseService = new DatabaseService();
        service = new VirtualPlayerNamesService(databaseService);
    });

    it('Should only add a name if name is not already in list', async () => {
        const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };
        service.addName(name);
    });
    it('should have only the default names after calling reset', () => {
        const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };
        service.addName(name);
        service.reset();
    });
});
