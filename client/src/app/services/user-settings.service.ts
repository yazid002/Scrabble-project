import { Injectable } from '@angular/core';
import * as GAME_SETTINGS from '@app/classes/game-options';

@Injectable({
    providedIn: 'root',
})
export class UserSettingsService {
    gameMode: string;
    userName: string;
    computerLevel: string;
    numPlayers: string;

    validateName(name: string): { error: boolean; errorMessage: string } {
        let error = false;
        let errorMessage = '';
        for (const pattern of GAME_SETTINGS.NAME_OPTION.allowedPattern) {
            if (!pattern.rule.test(name)) {
                error = true;
                errorMessage = pattern.errorMessage;

                return { error, errorMessage };
            }
        }
        return { error, errorMessage };
    }
}
