import { TestBed } from '@angular/core/testing';
import { SoundManagerService } from './sound-manager.service';

describe('SoundManagerService', () => {
    let service: SoundManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoundManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('playGoalAchievementAudio should play an audio', () => {
        const anAudio: HTMLAudioElement = {
            src: 'une source',
            load: () => void '',
            play: async () => Promise.resolve(void ''),
            addEventListener: () => void '',
        } as unknown as HTMLAudioElement;

        const audioSpy = spyOn(global, 'Audio').and.returnValue(anAudio);

        const loadSpy = spyOn(anAudio, 'load').and.returnValue(void '');

        const playSpy = spyOn(anAudio, 'play').and.returnValue(Promise.resolve(void ''));

        service.playGoalAchievementAudio();
        expect(audioSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalled();
        expect(playSpy).toHaveBeenCalled();
    });

    it('playQuitGameAudio should play an audio', () => {
        const anAudio: HTMLAudioElement = {
            src: 'une source',
            load: () => void '',
            play: async () => Promise.resolve(void ''),
            addEventListener: () => void '',
        } as unknown as HTMLAudioElement;

        const audioSpy = spyOn(global, 'Audio').and.returnValue(anAudio);

        const loadSpy = spyOn(anAudio, 'load').and.returnValue(void '');

        const playSpy = spyOn(anAudio, 'play').and.returnValue(Promise.resolve(void ''));

        service.playQuitGameAudio();
        expect(audioSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalled();
        expect(playSpy).toHaveBeenCalled();
    });
});
