import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { ExchangeLimits } from '@app/enums/exchange-enums';
import { SelectionType } from '@app/enums/selection-enum';
import { ExchangeService } from '@app/services/exchange.service';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { PlaceSelectionService } from '@app/services/place-selection.service';
import { RackLettersManipulationService } from '@app/services/rack-letters-manipulation.service';
import { ReserveService } from '@app/services/reserve.service';
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
    receptor: HTMLElement = {} as HTMLElement;
    command: string = '';
    //  selectionType: typeof SelectionType;

    constructor(
        public gridService: GridService,
        private gameService: GameService,
        private virtualPlayerService: VirtualPlayerService,
        private placeSelectionService: PlaceSelectionService,
        private exchangeService: ExchangeService,
        private reserveService: ReserveService,

        private rackLettersManipulationService: RackLettersManipulationService,
        private selectionManager: SelectionManagerService,
    ) {
        console.log(this.gameService);
        console.log(this.virtualPlayerService);
    }

    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        this.selectionManager.onKeyBoardClick(event);
    }

    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        console.log(this.selectionManager.selectionType);

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

    ngAfterViewInit(): void {
        this.selectionManager.chatboxComponent = this.chatboxComponent;
        console.log('kkkjhjh ', this.chatboxComponent);
    }

    onSubmitPlacement(selectionType: SelectionType) {
        this.selectionManager.getSelectionType(selectionType);
        // this.command = this.placeSelectionService.command;
        // console.log('la commande ici', this.command);
        // this.chatboxComponent.inputBox = this.command;
        // this.chatboxComponent.fromSelection = true;
        // this.chatboxComponent.onSubmit();
        //  this.selectionManager.onSubmitPlacement();
        const keyEvent = {
            key: 'Enter',
            preventDefault: () => void '',
        } as KeyboardEvent;
        this.selectionManager.onKeyBoardClick(keyEvent);
    }

    disablePlacement() {
        return this.placeSelectionService.selectedRackIndexesForPlacement.length === 0;
    }

    onCancelPlacement(selectionType: SelectionType) {
        this.selectionManager.getSelectionType(selectionType);
        const keyEvent = {
            key: 'Escape',
            preventDefault: () => void '',
        } as KeyboardEvent;
        this.selectionManager.onKeyBoardClick(keyEvent);
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

    onSubmitExchange(selectionType: SelectionType) {
        // this.receptor = this.playAreaComponent.rackCanvas.nativeElement;
        console.log('submit exchange', selectionType);
        this.selectionManager.getSelectionType(selectionType);
        this.command = this.exchangeService.buildExchangeCommand(this.gameService.players[0].rack);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }
    onCancelManipulation(selectionType: SelectionType) {
        this.selectionManager.getSelectionType(selectionType);
        //  this.receptor = this.playAreaComponent.rackCanvas.nativeElement;
        this.rackLettersManipulationService.cancelManipulation();
    }

    disableManipulation() {
        return this.rackLettersManipulationService.selectedIndexes.length === 0;
    }
    disableExchange() {
        return this.exchangeService.selectedIndexes.length === 0 || this.reserveService.getQuantityOfAvailableLetters() < ExchangeLimits.Max;
    }

    onCancelExchange(selectionType: SelectionType) {
        this.selectionManager.getSelectionType(selectionType);
        this.receptor = this.playAreaComponent.rackCanvas.nativeElement;
        this.exchangeService.cancelExchange();
    }

    get selectionType(): typeof SelectionType {
        return SelectionType;
    }
}
