import { Component, HostListener, ViewChild } from '@angular/core';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { ExchangeService } from '@app/services/exchange.service';
import { GameSyncService } from '@app/services/game-sync.service';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { PlaceSelectionService } from '@app/services/place-selection.service';
import { Room, RoomService } from '@app/services/room.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    @ViewChild(ChatboxComponent) chatboxComponent: ChatboxComponent;
    @ViewChild(PlayAreaComponent) playAreaComponent: PlayAreaComponent;
    // TODO verifier si les services en parametre sont utilises ou doivent en private
    // TODO enlever le roomName et isMaster une fois que le loby est intégré et créé les salles pour nous
    roomName: string = '';
    isMaster: boolean = false;
    rooms: Room[];

    receptor: HTMLElement = {} as HTMLElement;
    command: string = '';

    constructor(
        public gridService: GridService,
        private gameService: GameService,
        private virtualPlayerService: VirtualPlayerService,
        public roomService: RoomService,
        private gameSyncService: GameSyncService,
        private placeSelectionService: PlaceSelectionService, //  private readonly rackService: RackService,
        public exchangeService: ExchangeService,
    ) {
        this.virtualPlayerService.initialize();
        this.gameSyncService.initialize();
    }

    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        // console.log(event.key);
        // console.log('bla ', this.receptor);
        if (this.receptor === this.playAreaComponent.gridCanvas.nativeElement) {
            if (event.key === 'Escape' || (event.key === 'Backspace' && this.placeSelectionService.selectedTilesForPlacement.length <= 1)) {
                this.receptor = {} as HTMLElement;
            }
            this.placeSelectionService.onKeyBoardClick(event, this.gameService.players[0].rack);
            if (event.key === 'Enter') {
                console.log('ici Enter ');
                this.receptor = {} as HTMLElement;
                this.onSubmitPlacement();
            }
            // this.receptor = {} as HTMLElement;
        }
        //  else {
        //     console.log('je cancel');
        //     this.placeSelectionService.cancelPlacement();
        //     this.receptor = {} as HTMLElement;
        //     console.log(this.receptor);
        // }
    }

    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        this.receptor = event.target as HTMLElement;
        if (this.receptor === this.playAreaComponent.gridCanvas.nativeElement) {
            this.placeSelectionService.onBoardClick(event, true);
        } else {
            console.log('je suis la');
            this.placeSelectionService.cancelPlacement();
            this.receptor = {} as HTMLElement;
        }
    }

    onSubmitPlacement() {
        // this.command = this.rackSelectionService.buildPlacementCommand(this.rackService.rackLetters);
        this.command = this.placeSelectionService.command;
        console.log('la commande ici', this.command);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
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
    onSubmitExchange() {
        this.command = this.exchangeService.buildExchangeCommand(this.gameService.players[0].rack);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }

    disableExchange() {
        return this.exchangeService.selectedIndexes.length === 0;
    }

    onCancelExchange() {
        this.exchangeService.cancelExchange();
    }
}
