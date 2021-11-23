import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SoundManagerService {
    mainPageAudio = new Audio('assets/sounds/mainpage.mp3');

    playMainPageAudio(): void {
        if (this.mainPageAudio.paused) {
            this.mainPageAudio.load();
            this.mainPageAudio.autoplay = true;
            this.mainPageAudio.play();
        } else {
            this.mainPageAudio.pause();
        }
    }

    stopMainPageAudio(): void {
        this.mainPageAudio.pause();
    }

    playPlacementAudio(): void {
        const validPlacementAudio = new Audio();
        validPlacementAudio.src = 'assets/sounds/place.wav';
        validPlacementAudio.load();
        validPlacementAudio.autoplay = true;
        validPlacementAudio.play();
    }

    playClickOnButtonAudio(): void {
        const clickOnButtonAudio = new Audio();
        clickOnButtonAudio.src = 'assets/sounds/click.wav';
        clickOnButtonAudio.load();
        clickOnButtonAudio.autoplay = true;
        clickOnButtonAudio.play();
    }

    playGoalAchievementAudio(): void {
        const goalAchievementAudio = new Audio();
        goalAchievementAudio.src = 'assets/sounds/bonus.wav';
        goalAchievementAudio.load();
        goalAchievementAudio.autoplay = true;
        goalAchievementAudio.play();
    }

    playQuitGameAudio(): void {
        const quitGameAudio = new Audio();
        quitGameAudio.src = 'assets/sounds/quit.wav';
        quitGameAudio.load();
        quitGameAudio.autoplay = true;
        quitGameAudio.play();
    }

    playNonValidPlacementAudio(): void {
        const nonValidPlacementAudio = new Audio();
        nonValidPlacementAudio.src = 'assets/sounds/warning.wav';
        nonValidPlacementAudio.load();
        nonValidPlacementAudio.autoplay = true;
        nonValidPlacementAudio.play();
    }
    // muteAllSound(isMuted: boolean): void {
    //     // this.mainPageAudio.muted = isMuted;
    //     this.quitGameAudio.muted = isMuted;
    //     this.nonValidPlacementAudio.muted = isMuted;
    //     this.goalAchievementAudio.muted = isMuted;
    //     this.clickOnButtonAudio.muted = isMuted;
    //     this.validPlacementAudio.muted = isMuted;
    //     // this.mainPageAudio.muted = isMuted;
    // }
}
