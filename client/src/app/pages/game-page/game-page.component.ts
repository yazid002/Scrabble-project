import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { OperationType, SelectionType } from '@app/enums/selection-enum';
import { GameSyncService } from '@app/services/game-sync.service';
import { GridService } from '@app/services/grid.service';
import { RandomModeService } from '@app/services/random-mode.service';
import { Room, RoomService } from '@app/services/room.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements AfterViewInit {
    @ViewChild(ChatboxComponent) chatboxComponent: ChatboxComponent;
    @ViewChild(PlayAreaComponent) playAreaComponent: PlayAreaComponent;

    // TODO verifier si les services en parametre sont utilises ou doivent en private
    // TODO enlever le roomName et isMaster une fois que le loby est intégré et créé les salles pour nous
    roomName: string = '';
    isMaster: boolean = false;
    rooms: Room[];

    constructor(
        private gridService: GridService,
        private virtualPlayerService: VirtualPlayerService,
        public roomService: RoomService,
        public gameSyncService: GameSyncService,
        private selectionManager: SelectionManagerService,
        private randomMode: RandomModeService,
    ) {
        this.virtualPlayerService.initialize();
        this.gameSyncService.initialize();
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

    // ngOnInit(): void {
    //     this.gameSyncService.sendToLocalStorage();
    // }

    ngAfterViewInit(): void {
        this.selectionManager.chatboxComponent = this.chatboxComponent;
    }

    // TODO enlever goInRoom une fois que le loby est intégré et créé les salles pour nous
    goInRoom() {
        let temp = 'Vous avez ';
        if (this.isMaster) {
            this.roomService.createRoom();
            temp += 'créé une salle ';
        } else {
            this.roomService.joinRoom(this.roomName);
            temp += 'joint la salle ';
        }
        this.roomName = temp + this.roomName;
    }

    randomNumber() {
        this.randomMode.randomizeBonus(0, 3);
    }

    increaseSize(): void {
        const step = 1;
        const maxValue = 22;
        this.gridService.increaseTileSize(step, step, maxValue);
    }

    decreaseSize() {
        const step = -1;
        const maxValue = 13;
        this.gridService.decreaseTileSize(step, step, maxValue);
    }

    onSubmitPlacement(selectionType: SelectionType) {
        this.selectionManager.onSubmitPlacement(selectionType);
    }

    hideOperation(operationType: OperationType) {
        return this.selectionManager.hideOperation(operationType);
    }

    onCancelPlacement(selectionType: SelectionType) {
        this.selectionManager.onCancelPlacement(selectionType);
    }

    onSubmitExchange(selectionType: SelectionType) {
        this.selectionManager.onSubmitExchange(selectionType);
    }

    onCancelManipulation(selectionType: SelectionType) {
        this.selectionManager.onCancelManipulation(selectionType);
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
    }

    get selectionType(): typeof SelectionType {
        return SelectionType;
    }

    get operationType(): typeof OperationType {
        return OperationType;
    }
}
