import { ChunkNode } from './chunk-node';

describe('ChunkNode', () => {
    it('should create an instance', () => {
        const word = 'allo'.split('');
        expect(new ChunkNode(word)).toBeTruthy();
    });
});
