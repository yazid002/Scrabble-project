import { Injectable } from '@angular/core';
import * as GAME_SETTINGS from '@app/classes/game-options';

@Injectable({
    providedIn: 'root',
})
export class UserSettingsService {
    settings = GAME_SETTINGS.SETTINGS;
    profile = GAME_SETTINGS.NAME_OPTION;
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
