import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { CommandError } from './classes/command-errors/command-error';
import { Point } from './classes/point';
import { Direction } from './models/lettre.model';
import { RackService } from './services/rack.service';
import { WordValidationService } from './services/word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class VerifyService {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    dim: number = 8;
    // grille: string[][] = [];
    constructor(private dictionaryService: WordValidationService, private rackService: RackService) {
        //  this.grille = new Array(this.dim).fill(false).map(() => new Array(this.dim).fill(''));
        tiles[4][3].letter = 'N';
        tiles[6][3].letter = 'E';
    }

    isFiting(p: Point, dir: Direction, word: string) {
        console.log('length: ', tiles.length);
        const caseRestant = dir === Direction.BOTTOM ? tiles.length - p.row : tiles.length - p.column;
        if (word.length > caseRestant) {
            console.log('je suis rentrée ici');
            throw new CommandError("Il n'y a pas assez de place pour ecrire ce mot");
            //  return false;
        }
        // const array: boolean[] = [];
        for (let i = 0; i < word.length; i++) {
            const charInBox = dir === Direction.RIGHT ? tiles[p.row][i + p.column - 1].letter : tiles[i + p.row][p.column - 1].letter;
            console.log('charInBox: ', charInBox);
            console.log('word.charAt(i): ', word.charAt(i));
            console.log("charInBox !== ''", charInBox !== '');
            console.log('charInBox !== word.charAt(i): ', charInBox !== word.charAt(i));

            // if (charInBox !== '') {
            //     if (charInBox === word.charAt(i)) {
            //         array[i] = true;
            //         //  return true;
            //     } else {
            //         array[i] = false;
            //     }
            // } else {
            //     array[i] = true;
            // }
            const letter = word.charAt(i) === word.charAt(i).toUpperCase() ? '*' : word.charAt(i);
            if (!this.isCaseEmpty(charInBox)) {
                if (!this.isLetterOnBoardTheSame(charInBox, letter)) {
                    // return false;
                    //  return true;
                    throw new CommandError('Il y a deja une lettre dans cette case');
                }
            } else if (!this.rackService.isLetterOnRack(letter)) {
                //  return false;
                throw new CommandError('Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet');
            }
            // } && charInBox !== word.charAt(i)) {
            //     console.log('je suis rentrée labas');
            //     return false;
            // }
        }
        // for (const a of array) {
        //     if (a === false) {
        //         return false;
        //     }
        // }
        // p.column -= 1;
        //   console.log(this.verifyAllWords(p, dir, word));

        return true;
    }

    isCaseEmpty(letterToCheck: string): boolean {
        return letterToCheck === '';
    }

    isLetterOnBoardTheSame(letterToCheck: string, letter: string): boolean {
        return letterToCheck === letter;
    }

    // isWordOnBoard(posChar: PosChars, dir: Direction): {

    // }

    getWord(p: Point, dir: Direction) {
        // eslint-disable-next-line max-len
        // positioner les index fromIndex(debut du mot a extraire pour verifier si tjrs dans le dictionnaire) a la position d'une lettre avec l'expression ternaire(not lambda)
        // eslint-disable-next-line max-len
        // positioner les index toIndex(fin du mot a extraire pour verifier si tjrs dans le dictionnaire) a la position d'une lettre avec l'expression ternaire(not lambda)
        // par exemple : CANADA au debut sur C, ensuite sur A, ensuite sur N, ...
        console.log('on est ou ', p.row, p.column);
        p.row -= 2;
        let fromIndex: number = dir === Direction.BOTTOM ? p.row : p.column;
        let toIndex: number = dir === Direction.BOTTOM ? p.row : p.column;
        let newWord = ''; // le mot a extraire

        console.log('y a quoi dedans : ', tiles[fromIndex - 2][p.column - 1]);

        // reculer fromIndex jusqu'au debut du mot a extraire (jusqu'au un case vide)
        if (dir === Direction.BOTTOM) {
            while (fromIndex >= 0 && tiles[fromIndex][p.column].letter !== '') {
                fromIndex--;
            }
            // avancer toIndex jusqu'au la fin du mot a extraire (jusqu'au un case vide)
            while (toIndex < tiles.length && tiles[toIndex][p.column].letter !== '') {
                toIndex++;
            }
            // puis extraire le mot a tester par concatenation
            for (let i = fromIndex; i < toIndex; i++) {
                newWord += tiles[i][p.column];
            }
        }

        if (dir === Direction.RIGHT) {
            console.log(p.row, fromIndex);
            while (fromIndex >= 0 || tiles[p.row][fromIndex].letter !== '') {
                fromIndex--;
            }
            while (toIndex < tiles.length || tiles[p.row][toIndex].letter !== '') {
                toIndex++;
            }
            for (let i = fromIndex; i <= toIndex; i++) {
                newWord += tiles[i][p.column];
            }
        }
        return newWord;
    }

    verifyAllWords(p: Point, dir: Direction, word: string) {
        //  p.column -= 2;
        console.log('la direction est ', dir.toString());
        if (dir === Direction.RIGHT) {
            console.log('je suis dans le if');
            console.log('p :', p.row, p.column);
            for (let i = p.column; i <= p.column + word.length; i++) {
                console.log('je suis dans le for');
                const newPoint = new Point(p.row, i);
                console.log('dans dico?: ', this.dictionaryService.checkWordExists(this.getWord(newPoint, dir)));
                const theWord = this.getWord(newPoint, dir);

                console.log('le mot :', theWord);
                console.log('exist :', this.dictionaryService.checkWordExists(theWord));
                if (!this.dictionaryService.checkWordExists(this.getWord(newPoint, dir))) {
                    return false;
                }
            }
        }
        if (dir === Direction.BOTTOM) {
            for (let i = p.row; i <= word.length; i++) {
                const newPoint = new Point(i, p.column);

                console.log('dans dico?: ', this.dictionaryService.checkWordExists(this.getWord(newPoint, dir)));
                const theWord = this.getWord(newPoint, dir);

                console.log('le mot :', theWord);
                console.log('exist :', this.dictionaryService.checkWordExists(theWord));

                if (!this.dictionaryService.checkWordExists(this.getWord(newPoint, dir))) {
                    return false;
                }
            }
        }
        return true;
    }

    isAllValid(p: Point, dir: Direction, word: string) {
        // if (this.isFiting(p, dir, word) && this.verifyAllWords(p, dir, word)) {
        //     return true;
        // } else {
        //     return false;
        // }
        console.log('isFitting: ', this.isFiting(p, dir, word));
        console.log('verifyWord: ', this.verifyAllWords(p, dir, word));
        return this.isFiting(p, dir, word);
        // && this.verifyAllWords(p, dir, word);
    }
}
