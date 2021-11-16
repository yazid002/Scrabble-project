import { DictNode } from './dict-node';

describe('DictNode', () => {
    it('should create an instance', () => {
        const letterOfNode = 'a';
        expect(new DictNode(letterOfNode)).toBeTruthy();
    });
});
