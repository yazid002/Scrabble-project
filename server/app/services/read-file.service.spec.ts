import { expect } from 'chai';
import { Container } from 'typedi';
import { ReadFileService } from './read-file.service';

describe('ReadFileService', () => {
    let readFileService: ReadFileService;

    beforeEach(async () => {
        readFileService = Container.get(ReadFileService);
    });

    it('should read the dictionary file', async () => {
        const result = await readFileService.readDictionary('../server/app/test-utils/test-file.json');
        expect(result.title).to.equal('dico test');
    });

    it('should return an error if the path is not right', async () => {
        readFileService.readDictionary('../blabla/app/test-utils/test-file.json').catch((error) => {
            expect(error.code).equal('ENOENT');
        });
    });
});
