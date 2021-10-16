import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Vec2 } from '@app/classes/vec2';
import { VerifyService } from '@app/services/verify.service';
import { GridService } from './grid.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceService {
    lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
    points: number = 0;
    constructor(
        private rackService: RackService,
        private verifyService: VerifyService,
        private gridService: GridService,
        private pointsCountingService: PointsCountingService,
        private reserveService: ReserveService,
        private timerService: TimerService,
    ) {
        pointsCountingService.reserve = this.reserveService.alphabets;
    }
    placeWordInstant(word: string, coord: Vec2, direction: string): boolean {
        word = this.verifyService.normalizeWord(word);

        this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word, coord, direction);

        const wordValidationParameters = this.verifyService.checkAllWordsExist(word, coord);
        if (wordValidationParameters.wordExists) {
            this.writeWord(word, coord, direction);
            this.updateTilesLetters(word, coord, direction);
            this.points += this.pointsCountingService.getWordBasePoints(word);
            this.rackService.replaceWord(word);

            // this.timerService.resetTimer();
        }

        return wordValidationParameters.wordExists;
    }
    async placeWord(word: string, coord: Vec2, direction: string): Promise<void> {
        word = this.verifyService.normalizeWord(word);

        const promise = new Promise<void>((resolve, reject) => {
            this.lettersUsedOnBoard = this.verifyService.validatePlaceFeasibility(word, coord, direction);
            this.writeWord(word, coord, direction);

            const wordValidationParameters = this.verifyService.checkAllWordsExist(word, coord);
            if (!wordValidationParameters.wordExists) {
                const placementDuration = 3000; // 3000 millisecondes soit 3s;
                for (let i = 0; i < word.length; i++) {
                    const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
                    const x = computingCoord.x;
                    const y = computingCoord.y;

                    tiles[x][y].text = tiles[x][y].oldText;
                    tiles[x][y].style = tiles[x][y].oldStyle;
                    setTimeout(() => {
                        this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
                    }, placementDuration);
                }

                reject(new ImpossibleCommand(wordValidationParameters.errorMessage));
            } else {
                this.updateTilesLetters(word, coord, direction);
                this.points += this.pointsCountingService.getWordBasePoints(word);
                resolve(this.rackService.replaceWord(word));

                this.timerService.resetTimer();
            }
        });
        return promise;
    }

    updateTilesLetters(word: string, coord: Vec2, direction: string): void {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;
            tiles[x][y].letter = word[i].toLowerCase();
        }
    }

    writeWord(word: string, coord: Vec2, direction: string) {
        for (let i = 0; i < word.length; i++) {
            const computingCoord = this.verifyService.computeCoordByDirection(direction, coord, i);
            const x = computingCoord.x;
            const y = computingCoord.y;

            tiles[x][y].oldStyle = tiles[x][y].style;
            tiles[x][y].style = this.gridService.letterStyle;

            tiles[x][y].oldText = tiles[x][y].text;
            tiles[x][y].text = word[i];
            this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
        }
    }
}
