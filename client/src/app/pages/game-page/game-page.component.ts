import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PLAYER } from '@app/classes/player';
import { ABANDON_SIGNAL } from '@app/classes/signal';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { OpponentQuitDialogComponent } from '@app/components/opponent-quit-dialog/opponent-quit-dialog.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { OperationType, SelectionType } from '@app/enums/selection-enum';
import { NamesService } from '@app/services/admin/names.service';
import { PassExecutionService } from '@app/services/command-execution/pass-execution.service';
import { GameSyncService } from '@app/services/game-sync.service';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { Room, RoomService } from '@app/services/room.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { TimerService } from '@app/services/timer.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements AfterViewInit {
    @ViewChild(ChatboxComponent) chatboxComponent: ChatboxComponent;
    @ViewChild(PlayAreaComponent) playAreaComponent: PlayAreaComponent;

    roomName: string = '';
    isMaster: boolean;
    rooms: Room[];

    player: { realPlayer: number; otherPlayer: number };

    constructor(
        private gridService: GridService,
        private virtualPlayerService: VirtualPlayerService,
        public roomService: RoomService,
        public gameSyncService: GameSyncService,
        private selectionManagerService: SelectionManagerService,
        private timerService: TimerService,
        private matDialog: MatDialog,
        public gameService: GameService,
        public soundManagerService: SoundManagerService,
        private namesService: NamesService,
        private userSettingsService: UserSettingsService,
        private passExecutionService: PassExecutionService,
    ) {
        this.player = PLAYER;
        this.virtualPlayerService.initialize();
        this.gameSyncService.initialize();
        this.timerService.startTimer();
        this.gameService.convertToSoloSignal.subscribe((signal: string) => {
            this.showAbandonDIalog(signal);
        });
        const computerLevel = this.userSettingsService.settings.computerLevel.currentChoiceKey;
        const computerName = this.namesService.getRandomName(computerLevel);
        this.gameService.players[PLAYER.otherPlayer].name = computerName;
    }
    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        this.selectionManagerService.onKeyBoardClick(event);
    }

    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        this.selectionManagerService.onLeftClick(event);
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        this.selectionManagerService.onRightClick(event);
    }

    @HostListener('window:wheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        this.selectionManagerService.onMouseWheel(event);
    }

    ngAfterViewInit(): void {
        this.selectionManagerService.chatboxComponent = this.chatboxComponent;
    }

    increaseSize(): void {
        const step = 1;
        const maxValue = 26;
        this.gridService.increaseTileSize(step, step, maxValue);
        this.soundManagerService.playClickOnButtonAudio();
        this.selectionManagerService.updateSelectionType(SelectionType.LetterSizeButton);
    }

    decreaseSize() {
        const step = -1;
        const maxValue = 17;
        this.gridService.decreaseTileSize(step, step, maxValue);
        this.soundManagerService.playClickOnButtonAudio();
        this.selectionManagerService.updateSelectionType(SelectionType.LetterSizeButton);
    }

    onSubmitPlacement(selectionType: SelectionType) {
        this.selectionManagerService.onSubmitPlacement(selectionType);
    }

    hideOperation(operationType: OperationType) {
        return this.selectionManagerService.hideOperation(operationType);
    }

    onCancelPlacement(selectionType: SelectionType) {
        this.selectionManagerService.onCancelPlacement(selectionType);
        this.soundManagerService.playClickOnButtonAudio();
    }

    onSubmitExchange(selectionType: SelectionType) {
        this.selectionManagerService.onSubmitExchange(selectionType);
        this.soundManagerService.playClickOnButtonAudio();
    }

    onCancelManipulation(selectionType: SelectionType) {
        this.selectionManagerService.onCancelManipulation(selectionType);
        this.soundManagerService.playClickOnButtonAudio();
    }

    disableManipulation() {
        return this.selectionManagerService.disableManipulation();
    }
    disableExchange() {
        return this.selectionManagerService.disableExchange();
    }
    hideExchangeButton() {
        return this.selectionManagerService.hideExchangeButton();
    }

    onCancelExchange(selectionType: SelectionType) {
        this.selectionManagerService.onCancelExchange(selectionType);
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
