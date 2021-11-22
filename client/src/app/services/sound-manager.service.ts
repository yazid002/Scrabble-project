import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SoundManagerService {
    mainPageAudio = new Audio('assets/sounds/mainpage.mp3');
    validPlacementAudio = new Audio('assets/sounds/place.wav');
    clickOnButtonAudio = new Audio('assets/sounds/click.wav');
    goalAchievementAudio = new Audio('assets/sounds/bonus.wav');
    quitGameAudio = new Audio('assets/sounds/quit.wav');
    nonValidPlacementAudio = new Audio('assets/sounds/warning.wav');

    playMainPageAudio(): void {
        if (this.mainPageAudio.paused) {
            this.mainPageAudio.load();

            this.mainPageAudio.play();
        } else {
            this.mainPageAudio.pause();
        }
    }

    stopMainPageAudio(): void {
        this.mainPageAudio.pause();
    }

    playPlacementAudio(): void {
        this.validPlacementAudio.load();
        this.validPlacementAudio.play();
    }

    playClickOnButtonAudio(): void {
        this.clickOnButtonAudio.load();
        this.clickOnButtonAudio.play();
    }

    playGoalAchievementAudio(): void {
        this.goalAchievementAudio.load();
        this.goalAchievementAudio.play();
    }

    playQuitGameAudio(): void {
        this.quitGameAudio.load();
        this.quitGameAudio.play();
    }

    playNonValidPlacementAudio(): void {
        this.nonValidPlacementAudio.load();
        this.nonValidPlacementAudio.play();
    }

    muteAllSound(isMuted: boolean): void {
        this.mainPageAudio.muted = isMuted;
        this.quitGameAudio.muted = isMuted;
        this.nonValidPlacementAudio.muted = isMuted;
        this.goalAchievementAudio.muted = isMuted;
        this.clickOnButtonAudio.muted = isMuted;
        this.validPlacementAudio.muted = isMuted;
        this.mainPageAudio.muted = isMuted;
    }
}
