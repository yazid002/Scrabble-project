import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PLAYER } from '@app/classes/player';
import { ABANDON_SIGNAL } from '@app/classes/signal';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { OpponentQuitDialogComponent } from '@app/components/opponent-quit-dialog/opponent-quit-dialog.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { OperationType, SelectionType } from '@app/enums/selection-enum';
import { PassExecutionService } from '@app/services/command-execution/pass-execution.service';
import { GameSyncService } from '@app/services/game-sync.service';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { RandomModeService } from '@app/services/random-mode.service';
import { Room, RoomService } from '@app/services/room.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { TimerService } from '@app/services/timer.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements AfterViewInit, OnInit {
    @ViewChild(ChatboxComponent) chatboxComponent: ChatboxComponent;
    @ViewChild(PlayAreaComponent) playAreaComponent: PlayAreaComponent;

    // TODO verifier si les services en parametre sont utilises ou doivent en private
    // TODO enlever le roomName et isMaster une fois que le loby est intégré et créé les salles pour nous
    roomName: string = '';
    isMaster: boolean;
    rooms: Room[];

    player: { realPlayer: number; otherPlayer: number };

    constructor(
        private gridService: GridService,
        private virtualPlayerService: VirtualPlayerService,
        public roomService: RoomService,
        public gameSyncService: GameSyncService,
        private selectionManager: SelectionManagerService,
        private randomMode: RandomModeService,
        private timerService: TimerService,
        private matDialog: MatDialog,
        public gameService: GameService,
        public soundManagerService: SoundManagerService,
        private passExecutionService: PassExecutionService,
    ) {
        this.player = PLAYER;
        this.virtualPlayerService.initialize();
        this.gameSyncService.initialize();
        this.timerService.startTimer();
        this.gameService.convertToSoloSignal.subscribe((signal: string) => {
            this.showAbandonDIalog(signal);
        });
    }
    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        this.selectionManager.onKeyBoardClick(event);
    }

    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        this.selectionManager.onLeftClick(event);
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        this.selectionManager.onRightClick(event);
    }

    @HostListener('window:wheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        this.selectionManager.onMouseWheel(event);
    }

    ngOnInit(): void {
        this.soundManagerService.stopMainPageAudio();
    }

    ngAfterViewInit(): void {
        this.selectionManager.chatboxComponent = this.chatboxComponent;
    }

    randomNumber() {
        this.randomMode.randomizeBonus(0, 3);
    }

    increaseSize(): void {
        const step = 1;
        const maxValue = 26;
        this.gridService.increaseTileSize(step, step, maxValue);
        this.soundManagerService.playClickOnButtonAudio();
    }

    decreaseSize() {
        const step = -1;
        const maxValue = 17;
        this.gridService.decreaseTileSize(step, step, maxValue);
        this.soundManagerService.playClickOnButtonAudio();
    }

    onSubmitPlacement(selectionType: SelectionType) {
        this.selectionManager.onSubmitPlacement(selectionType);
    }

    hideOperation(operationType: OperationType) {
        return this.selectionManager.hideOperation(operationType);
    }

    onCancelPlacement(selectionType: SelectionType) {
        this.selectionManager.onCancelPlacement(selectionType);
        this.soundManagerService.playClickOnButtonAudio();
    }

    onSubmitExchange(selectionType: SelectionType) {
        this.selectionManager.onSubmitExchange(selectionType);
        this.soundManagerService.playClickOnButtonAudio();
    }

    onCancelManipulation(selectionType: SelectionType) {
        this.selectionManager.onCancelManipulation(selectionType);
        this.soundManagerService.playClickOnButtonAudio();
    }

    disableManipulation() {
        return this.selectionManager.disableManipulation();
    }
    disableExchange() {
        return this.selectionManager.disableExchange();
    }
    hideExchangeButton() {
        return this.selectionManager.hideExchangeButton();
    }

    onCancelExchange(selectionType: SelectionType) {
        this.selectionManager.onCancelExchange(selectionType);
        this.soundManagerService.playClickOnButtonAudio();
    }

    skipTurn(): void {
        this.passExecutionService.execute();
    }

    get selectionType(): typeof SelectionType {
        return SelectionType;
    }

    get operationType(): typeof OperationType {
        return OperationType;
    }
    private showAbandonDIalog(signal: string) {
        if (signal === ABANDON_SIGNAL) this.matDialog.open(OpponentQuitDialogComponent);
    }
}
