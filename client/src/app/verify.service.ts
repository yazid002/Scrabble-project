import { Injectable } from '@angular/core';
import { Direction, Point } from './models/lettre.model';

@Injectable({
    providedIn: 'root',
})
export class VerifyService {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    dim: number = 8;
    grille: string[][] = [];
    constructor(private dictionaryService: DictionaryService, private grilleService: GrilleService) {
        this.grille = new Array(this.dim).fill(false).map(() => new Array(this.dim).fill(''));
        this.grille[4][3] = 'N';
        this.grille[6][3] = 'E';
        this.grille[4][5] = 'D';
    }

    isFiting(p: Point, dir: Direction, word: string) {
        const caseRestant = dir === Direction.BOTTOM ? this.grille.length - p.row : this.grille.length - p.column;
        if (word.length > caseRestant) {
            return false;
        }
        for (let i = 0; i < word.length; i++) {
            const charInBox = dir === Direction.RIGHT ? this.grille[p.row][i + p.column] : this.grille[i + p.row][p.column];
            if (charInBox !== '' && charInBox !== word.charAt(i)) {
                return false;
            }
        }
        return true;
    }

    getWord(p: Point, dir: Direction) {
        // eslint-disable-next-line max-len
        // positioner les index fromIndex(debut du mot a extraire pour verifier si tjrs dans le dictionnaire) a la position d'une lettre avec l'expression ternaire(not lambda)
        // eslint-disable-next-line max-len
        // positioner les index toIndex(fin du mot a extraire pour verifier si tjrs dans le dictionnaire) a la position d'une lettre avec l'expression ternaire(not lambda)
        // par exemple : CANADA au debut sur C, ensuite sur A, ensuite sur N, ...
        let fromIndex: number = dir === Direction.BOTTOM ? p.row : p.column;
        let toIndex: number = dir === Direction.BOTTOM ? p.row : p.column;
        let newWord = ''; // le mot a extraire

        // reculer fromIndex jusqu'au debut du mot a extraire (jusqu'au un case vide)
        if (dir === Direction.BOTTOM) {
            while (fromIndex >= 0 && this.grille[fromIndex][p.column] !== '') {
                fromIndex--;
            }
            // avancer toIndex jusqu'au la fin du mot a extraire (jusqu'au un case vide)
            while (toIndex < this.grille.length && this.grille[toIndex][p.column] !== '') {
                toIndex++;
            }
            // puis extraire le mot a tester par concatenation
            for (let i = fromIndex; i < toIndex; i++) {
                newWord += this.grille[i][p.column];
            }
        }

        if (dir === Direction.RIGHT) {
            while (fromIndex >= 0 || this.grille[p.row][fromIndex] !== '') {
                fromIndex--;
            }
            while (toIndex < this.grille.length || this.grille[p.row][toIndex] !== '') {
                toIndex++;
            }
            for (let i = fromIndex; i <= toIndex; i++) {
                newWord += this.grille[i][p.column];
            }
        }
        return newWord;
    }

    verifyAllWords(p: Point, dir: Direction, word: string) {
        if (dir === Direction.RIGHT) {
            for (let i = p.column; i <= word.length; i++) {
                const newPoint = new Point(p.row, i);
                if (!this.dictionaryService.isInDictionary(this.getWord(newPoint, dir))) {
                    return false;
                }
            }
        }
        if (dir === Direction.BOTTOM) {
            for (let i = p.row; i <= word.length; i++) {
                const newPoint = new Point(i, p.column);
                if (!this.dictionaryService.isInDictionary(this.getWord(newPoint, dir))) {
                    return false;
                }
            }
        }
        return true;
    }

    isAllValid(p: Point, dir: Direction, word: string) {
        if (this.isFiting(p, dir, word) && this.verifyAllWords(p, dir, word)) {
            return true;
        } else {
            return false;
        }
    }
}
