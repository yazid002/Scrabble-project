import * as DictFile from '@app/assets/dictionnary.json';
import { Dictionary } from '@app/classes/dictionary';
import { TitleDescriptionOfDictionary } from '@app/classes/title-description-of-dictionary';
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
const defaultDictionary = DictFile as Dictionary;
defaultDictionary.default = true;
defaultDictionary.words = ['aa', 'bb', 'cc']; // to speed up the tests, we make the words array smaller
describe('DictionaryService', () => {
    let service: DictionaryService;
    let readFileService: SinonStubbedInstance<ReadFileService>;
    beforeEach(async () => {
        readFileService = createStubInstance(ReadFileService);
        readFileService.readDictionary.resolves(DictFile as Dictionary);
        service = new DictionaryService(readFileService);
        service.dictionaries = [defaultDictionary];
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
        it('should remove the dictionary we want', () => {
            service.dictionaries.push(exampleDict);
            service.deleteDictionary(exampleDict.title);
            expect(service.dictionaries).not.to.contain(exampleDict);
            // expect(service.dictionaries).to.include(defaultDictionary);
        });
        it('should not let you delete a default dictionary', () => {
            service.deleteDictionary(defaultDictionary.title);
            expect(service.dictionaries).to.include(defaultDictionary);
        });
    });
    describe('findAllDictionaries', () => {
        it('should return a list of dictionarries without the words', () => {
            service.dictionaries = [defaultDictionary];
            const expectedResult: TitleDescriptionOfDictionary[] = [{ title: defaultDictionary.title, description: defaultDictionary.description }];
            const result = service.findAllDictionaries();
            expect(result).to.deep.equal(expectedResult);
        });
    });
    describe('getDictionary', () => {
        it('should return the needed dictionary', () => {
            const expectedResult = defaultDictionary;
            const result = service.getDictionary(defaultDictionary.title);
            expect(result).to.deep.equal(expectedResult);
        });
        it('should return undefined if we ask for a dictionary that does not exist', () => {
            const expectedResult = undefined;
            const result = service.getDictionary('invalid dictionary');
            expect(result).to.deep.equal(expectedResult);
        });
    });
});
