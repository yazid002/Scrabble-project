import * as dict from 'src/assets/dictionnary.json';
import { Dictionary } from './dictionary';
const dictionary: Dictionary = dict as Dictionary;
class ChunkNode {
    parent?: ChunkNode;
    child: ChunkNode[] = []; // child
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
            if (doesPatternExist(word)) {
                // make child
                const newChild: ChunkNode = new ChunkNode(unTestedChunkCopy, i, this);
                this.child.push(newChild);
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
        for (const child of currentNode.child) {
            if (child.child.length === 0) {
                if (doesWordExist(child.currentWord)){

                    patterns.push(child.currentWord);
                }
            }
            patterns = patterns.concat(child.getChildPatterns(child));
        }
        return patterns;
    }
}

const doesPatternExist: (pattern: string) => boolean = (pattern: string) => {
    const result = dictionary.words.find((word) => word.startsWith(pattern));
    if (result) return true;
    return false;
};

const doesWordExist: (pattern: string) => boolean = (pattern: string) => {
    const result = dictionary.words.find((word) => word === pattern);
    if (result) return true;
    return false;
};

export const generateAnagrams: (rack: string[], pattern: string) => string[] = (rack: string[], pattern: string) => {
    /**
     * Function to generate anagrams of valid words (words that are in the dictionary) and that contain a certain pattern in them
     * @param rack: provide the player's rack. To not include the pattern in the player's rack
     * @param pattern: anagrams will need to contain this pattern
     * @returns a list of words (strings) that contain only letters from the rack + the required pattern
     */
    let words: string[] = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
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
    return words.filter((word) => word.includes(pattern));
};
// const removeAndGetChunks: (chunks: string[], letterToRemove: string) => string[] = (chunks: string[], letterToRemove: string) => {
//     const letterToRemoveIndex = chunks.findIndex((letter) => letter === letterToRemove);
//     if (letterToRemoveIndex !== -1) {
//         chunks.splice(letterToRemoveIndex, 1);
//     }
//     return chunks;
// };
