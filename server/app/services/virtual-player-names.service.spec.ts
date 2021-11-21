import { expect } from 'chai';
import { VirtualPlayerNamesService } from './virtual-player-names.service';

interface NameProperties {
    name: string;
    default: boolean;
    isAdvanced: boolean;
}
describe('Example service', () => {
    let service: VirtualPlayerNamesService;

    beforeEach(async () => {
        service = new VirtualPlayerNamesService();
    });

    it('Should only add a name if name is not already in list', () => {
        const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };
        service.addName(name);
        const initArraySize = service.names.length;
        service.addName(name);
        expect(service.names.length).to.equal(initArraySize);
    });
    it('should have only the default names after calling reset', () => {
        const name: NameProperties = { name: 'a name', default: false, isAdvanced: true };
        service.addName(name);
        service.reset();
        let isAllDefault = true;
        for (const item of service.names) {
            if (!item.default) isAllDefault = false;
        }
        expect(isAllDefault).equal(true);
    });
});
