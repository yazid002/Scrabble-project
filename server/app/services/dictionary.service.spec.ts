import * as DictFile from '@app/assets/dictionnary.json';
import { Dictionary } from '@app/classes/dictionary';
import { expect } from 'chai';
import * as fs from 'fs';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
// disable car on importe une constante du coté client, on doit utiliser un pattern
// eslint-disable-next-line no-restricted-imports
import { DictionaryService } from './dictionary.service';
import { ReadFileService } from './read-file.service';
const exampleDict: Dictionary = {
    title: 'new dictionary',
    description: 'for testing purposes',
    words: ['aa', 'bb', 'cc'],
};
describe('WordValidationService', () => {
    let service: DictionaryService;
    let readFileService: SinonStubbedInstance<ReadFileService>;
    beforeEach(async () => {
        readFileService = createStubInstance(ReadFileService);
        readFileService.readDictionary.resolves(DictFile as Dictionary);
        service = new DictionaryService(readFileService);
    });
    describe('addDict', () => {
        const newDictFileName = 'newDict.json';
        beforeEach(() => {
            fs.writeFileSync(service.path + newDictFileName, JSON.stringify(exampleDict));
        });
        it('should add the received Dictionary to the dictionaries array and specify that it is not a default dictionary', async () => {
            readFileService.readDictionary.resolves(exampleDict);
            await service.addDict(newDictFileName);
            expect(service.dictionaries).to.contain(exampleDict);
        });
    });
    describe('deleteDictionary', () => {
        it('should remove the dictionary we want to remove', () => {
            service.dictionaries.push(exampleDict);
            service.deleteDictionary(exampleDict.title);
            expect(service.dictionaries).not.to.contain(exampleDict);
        });
    });
});
