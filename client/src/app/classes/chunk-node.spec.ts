// we must disable this import pattern warning because we need a file outside of the project scope (can't use '@app/' pattern)
// eslint-disable-next-line no-restricted-imports
import * as dictFile from '../../../../server/app/assets/dictionnary.json';
import { ChunkNode, setVirtualPlayerDictionary } from './chunk-node';
import { Dictionary } from './dictionary';
const dictionary = dictFile as Dictionary;
describe('ChunkNode', () => {
    it('should create an instance', () => {
        const word = 'allo'.split('');
        setVirtualPlayerDictionary(dictionary);
        expect(new ChunkNode(word)).toBeTruthy();
    });
});
