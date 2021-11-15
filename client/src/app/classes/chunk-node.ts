import * as dict from 'src/assets/dictionnary.json';
import { DictNode, convertDictToTree } from '@app/classes/dict-node';
import { Dictionary } from '@app/classes/dictionary';
const dictList: Dictionary = dict as Dictionary;
const dictionary: DictNode = convertDictToTree(dictList);
export class ChunkNode {
    parent?: ChunkNode;
    childs: ChunkNode[] = []; // child
    unTestedChunks: string[] = []; // letters remaining to build chils
    chunk: string; // chunk of note
    constructor(unTestedChunks: string[], indexToRemove?: number, parent?: ChunkNode) {
        if (parent) this.parent = parent;
        const unTestedChunkCopy: string[] = [];
        unTestedChunks.forEach((chunk) => unTestedChunkCopy.push(chunk));
        if (indexToRemove) this.chunk = unTestedChunkCopy.splice(indexToRemove, 1).join('');
        else this.chunk = unTestedChunkCopy.splice(0, 1).join('');
        this.unTestedChunks = unTestedChunkCopy;
        const testedChunks = this.currentWord;
        // for (const unTestedChunk of this.unTestedChunCopy) {
        let i = 0;
        while (i < this.unTestedChunks.length) {
            const word = testedChunks + this.unTestedChunks[i];
            if (dictionary.isPatternInDict(word)) {
                // make child
                this.addChild(unTestedChunkCopy, i);
            } else {
                if (this.unTestedChunks.length === 1) this.unTestedChunks = [];
                else this.unTestedChunks.splice(i, 1);
                i--;
            }
            i++;
        }
    }

    get testedParentWord(): string {
        const chunk: string[] = [];
        let parent = this.parent;
        // get parent chunks
        while (parent) {
            chunk.push(parent.chunk);
            parent = parent.parent;
        }
        return chunk.reverse().join('');
    }
    get currentWord(): string {
        return this.testedParentWord + this.chunk;
    }
    getChildPatterns(currentNode?: ChunkNode): string[] {
        let patterns: string[] = [];
        if (!currentNode) currentNode = this;
        for (const child of currentNode.childs) {
            if (child.childs.length === 0) {
                if (dictionary.isWordInDict(child.currentWord)) {
                    patterns.push(child.currentWord);
                }
            }
            patterns = patterns.concat(child.getChildPatterns(child));
        }
        return patterns;
    }
    private addChild(untestedChunks: string[], indexToremove: number) {
        const childLetter = untestedChunks[indexToremove];
        // find if there is an existing child with this letter
        for (const child of this.childs) {
            if (child.chunk === childLetter) return;
        }
        const newChild: ChunkNode = new ChunkNode(untestedChunks, indexToremove, this);
        this.childs.push(newChild);
    }
}

export const generateAnagrams: (rack: string[], pattern: string) => string[] = (rack: string[], pattern: string) => {
    /**
     * Function to generate anagrams of valid words (words that are in the dictionary) and that contain a certain pattern in them
     * @param rack: provide the player's rack. To not include the pattern in the player's rack
     * @param pattern: anagrams will need to contain this pattern
     * @returns a list of words (strings) that contain only letters from the rack + the required pattern
    */
    let words: string[] = [];
    let i = 0;
    const chunks: string[] = [];
    rack.forEach((letter) => chunks.push(letter));
    chunks.push(pattern);
    while (i < chunks.length) {
        const subAnagrams = new ChunkNode(chunks);
        words = words.concat(subAnagrams.getChildPatterns());
        const letterToChange = chunks[i];
        chunks.splice(i, 1);
        chunks.push(letterToChange);
        i++;
    }
    return [...new Set(words.filter((word) => word.includes(pattern)))];
};
