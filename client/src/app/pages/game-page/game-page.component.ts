import { Component, HostListener } from '@angular/core';
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
    // TODO verifier si les services en parametre sont utilises ou doivent en private
    // TODO enlever le roomName et isMaster une fois que le loby est intégré et créé les salles pour nous
    roomName: string = '';
    isMaster: boolean = false;
    rooms: Room[];
    constructor(
        public gridService: GridService,
        private gameService: GameService,
        private virtualPlayerService: VirtualPlayerService,
        public roomService: RoomService,
        private gameSyncService: GameSyncService,
        private placeSelectionService: PlaceSelectionService,
    ) {
        this.virtualPlayerService.initialize();
        this.gameSyncService.initialize();
    }

    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        this.placeSelectionService.onKeyBoardClick(event, this.gameService.players[0].rack);
    }

    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        this.placeSelectionService.onBoardClick(event);
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
}
