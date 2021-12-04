import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';
const MODE: IOptionList = {
    settingName: 'Mode de jeux',
    availableChoices: [
        { key: 'classic', value: 'Classique' },
        { key: 'log2990', value: 'LOG2990', disabled: true },
    ],
};
const NUM_PLAYERS: IOptionList = {
    settingName: 'Nombre de joueurs',
    availableChoices: [
        { key: 'solo', value: 'Solo' },
        { key: 'multiplayer', value: 'Multijoueurs', disabled: false },
    ],
};
const COMPUTER_LEVEL: IOptionList = {
    settingName: "Niveau de l'ordinateur",
    availableChoices: [{ key: 'beginner', value: 'Débutant' }],
};

const TIMER: IOptionList = {
    settingName: 'Temps maximal par tour',
    availableChoices: [
        { key: '30', value: '30s' },
        { key: '60', value: '1m' },
        { key: '90', value: '1m30s' },
    ],
};
describe('TimerService', () => {
    let service: TimerService;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(() => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries', 'getComputerName']);
        userSettingsServiceSpy.getDictionaries.and.returnValue(undefined);
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        userSettingsServiceSpy.nameOption.userChoice = 'un nom';
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.dictionnaires = [{ title: 'Espagnol', description: 'Langue espagnole' }];
        userSettingsServiceSpy.nameOption = NAME_OPTION;

        userSettingsServiceSpy.computerName = '';
        userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: UserSettingsService, useValue: userSettingsServiceSpy }],
        });
        service = TestBed.inject(TimerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should emit an event when timer hits zero', () => {
        let skipped = false;
        service.isEnabled = true;
        service.timerDone.next(skipped);
        service.counter = {
            min: 0,
            seconds: 0,
            resetValue: 60,
            totalTimer: 59,
        };
        service.counter.totalTimer = service.counter.resetValue - 1;
        // eslint-disable-next-line @typescript-eslint/no-shadow
        service.timerDone.subscribe((val) => {
            skipped = val;
        });
        // eslint-disable-next-line dot-notation
        service['decrementTime']();
        expect(skipped).toBe(true);
    });
    it('should not decrement timer if timer is not enabled', (done) => {
        service.isEnabled = false;
        const timeInit = 0;
        service.counter = {
            min: 0,
            seconds: 0,
            resetValue: 60,
            totalTimer: timeInit,
        };
        const numSeconds = 3;
        const miliInSeconds = 1000;
        service.startTimer();
        setTimeout(() => {
            expect(service.counter.totalTimer).toEqual(timeInit);
            done();
        }, numSeconds * miliInSeconds);
    });

    it('should not decrement timer if timer is not enabled', (done) => {
        service.isEnabled = false;
        const timeInit = 0;
        service.counter = {
            min: 0,
            seconds: 0,
            resetValue: 60,
            totalTimer: timeInit,
        };
        const numSeconds = 3;
        const miliInSeconds = 1000;
        service.startTimer();
        setTimeout(() => {
            expect(service.counter.totalTimer).toEqual(timeInit);
            done();
        }, numSeconds * miliInSeconds);
    });

    it('should decrement timer if timer is enabled', (done) => {
        service.isEnabled = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decrementTimeSpy = spyOn<any>(service, 'decrementTime');

        const timeInit = 0;
        service.counter = {
            min: 0,
            seconds: 0,
            resetValue: 60,
            totalTimer: timeInit,
        };
        const numSeconds = 3;
        const miliInSeconds = 1000;
        service.startTimer();
        setTimeout(() => {
            expect(decrementTimeSpy).toHaveBeenCalled();
            done();
        }, numSeconds * miliInSeconds);
    });

    it('nextReset value should equal to totalTimer + delay', () => {
        const delay = 20;
        const expectedResult = 30;
        service.counter.totalTimer = 10;
        service.resetTimerDelay(delay);

        expect(service.nextResetValue).toEqual(expectedResult);
    });
});
