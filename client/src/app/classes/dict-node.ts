import { Dictionary } from './dictionary';
export class DictNode {
    letter: string = '';
    isLeaf?: boolean;
    childs: DictNode[] = [];
    constructor(letter: string) {
        this.letter = letter;
    }
    addChild(letter: string): DictNode {
        let child = this.childs.find((node) => node.letter === letter);
        if (!child) {
            child = new DictNode(letter);
            this.childs.push(child);
        }
        return child;
    }
    addWord(word: string) {
        let i = 0;
        let child: DictNode = this;
        while (i < word.length) {
            child = child.addChild(word[i]);
            i++;
        }
        child.isLeaf = true;
    }
    isWordInDict(word: string): boolean {
        let child: DictNode | undefined = this;
        for (const letter of word) {
            child = child.childs.find((node) => node.letter === letter);
            if (!child) return false;
        }
        if (child.isLeaf) return true;
        return false;
    }
    isPatternInDict(word: string): boolean {
        let child: DictNode | undefined = this;
        for (const letter of word) {
            child = child.childs.find((node) => node.letter === letter);
            if (!child) return false;
        }

        return true;
    }
    // find(word: string): string | undefined {
    //     let child: DictNode | undefined = this;
    //     for (const letter of word) {
    //         child = child.childs.find((node) => node.letter === letter);
    //         if (!child) return;
    //     }
    //     return word;
    // }
}
export const convertDictToTree: (dict: Dictionary) => DictNode = (dict: Dictionary) => {
    const root = new DictNode('');
    dict.words.forEach((word) => root.addWord(word));
    return root;
};
