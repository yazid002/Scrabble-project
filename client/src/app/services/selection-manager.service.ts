import { Injectable } from '@angular/core';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { SelectionType } from '@app/enums/selection-enum';
import { ExchangeService } from './exchange.service';
import { GameService, REAL_PLAYER } from './game.service';
import { GridService } from './grid.service';
import { PlaceSelectionService } from './place-selection.service';
import { RackLettersManipulationService } from './rack-letters-manipulation.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionManagerService {
    selectionType = SelectionType.Chat;
    chatboxComponent: ChatboxComponent;
    command = '';
    constructor(
        public gridService: GridService,
        public exchangeService: ExchangeService,
        public reserveService: ReserveService,
        private readonly rackService: RackService,
        public rackLettersManipulationService: RackLettersManipulationService,
        private placeSelectionService: PlaceSelectionService, //  private readonly rackService: RackService,

        private gameService: GameService,
    ) {}

    // selectionToDo = ;

    getSelectionType(selectionTypeSelected: SelectionType) {
        this.selectionType = selectionTypeSelected;
    }

    onLeftClick(event: MouseEvent) {
        if (this.selectionType === SelectionType.Grid) {
            this.placeSelectionService.onBoardClick(event, true);
            this.exchangeService.cancelExchange();
            this.rackLettersManipulationService.cancelManipulation();
        } // si la lettre qu'on veut n'est pas selectionnee pour echange, on peut la selectionner pour manipulation
        else if (this.selectionType === SelectionType.Rack && this.exchangeService.selectedIndexes.length === 0) {
            this.rackLettersManipulationService.onMouseLeftClick(event, this.gameService.players[0].rack);
            this.placeSelectionService.cancelPlacement();
            // this.exchangeService.cancelExchange();
        } else {
            console.log('je suis la');
            this.placeSelectionService.cancelPlacement();
            //  this.exchangeService.cancelExchange();
            this.rackLettersManipulationService.cancelManipulation();
            if (this.selectionType === SelectionType.None) {
                this.selectionType = SelectionType.Rack;
            }
        }
    }

    onRightClick(event: MouseEvent) {
        event.preventDefault();
        // this.receptor = event.target as HTMLElement;
        if (this.selectionType !== SelectionType.Rack) {
            this.exchangeService.cancelExchange();
        } else {
            // si la lettre qu'on veut selectionner est deja selectionnee pour manipulation, elle devient selectionnee pour echange
            if (
                this.rackLettersManipulationService
                    .getSelectedLetters(this.gameService.players[0].rack)
                    .includes(
                        this.gameService.players[0].rack[
                            this.rackLettersManipulationService.getMouseClickIndex(event, this.gameService.players[0].rack)
                        ].name.toLowerCase(),
                    )
            ) {
                this.rackLettersManipulationService.cancelManipulation();
                // this.exchangeService.onMouseRightClick(event, this.gameService.players[0].rack);
            }
            // else {
            //     this.exchangeService.cancelExchange();
            // }
            //   this.rackLettersManipulationService.cancelManipulation();
            this.exchangeService.onMouseRightClick(event, this.gameService.players[0].rack);
        }
    }

    onKeyBoardClick(event: KeyboardEvent) {
        // console.log(event.key);
        // console.log('bla ', this.receptor);
        if (this.selectionType === SelectionType.Grid) {
            if (event.key === 'Escape' || (event.key === 'Backspace' && this.placeSelectionService.selectedTilesForPlacement.length <= 1)) {
                // this.receptor = {} as HTMLElement;
                this.selectionType = SelectionType.Rack;
            }
            this.placeSelectionService.onKeyBoardClick(event, this.gameService.players[0].rack);
            if (event.key === 'Enter') {
                console.log('ici Enter ');
                // this.receptor = {} as HTMLElement;
                if (this.gameService.currentTurn !== REAL_PLAYER) {
                    // this.chatboxComponent.error = true;
                    this.chatboxComponent.errorMessage = 'Attendez votre tour';
                    return;
                }
                this.onSubmitPlacement();
            }
            // this.receptor = {} as HTMLElement;
        } else if (this.selectionType === SelectionType.Rack) {
            if (this.rackService.isLetterOnRack(event.key) || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                this.rackLettersManipulationService.onKeyBoardClick(event, this.gameService.players[0].rack);
            } else {
                this.rackLettersManipulationService.cancelManipulation();
            }
        }
        //  else {
        //     console.log('je cancel');
        //     this.placeSelectionService.cancelPlacement();
        //     this.receptor = {} as HTMLElement;
        //     console.log(this.receptor);
        // }
    }

    onSubmitPlacement() {
        // this.command = this.rackSelectionService.buildPlacementCommand(this.rackService.rackLetters);
        // this.receptor = this.playAreaComponent.gridCanvas.nativeElement;
        this.command = this.placeSelectionService.command;
        console.log('la commande ici', this.command);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }

    // increaseSize(): void {
    //     const step = 1;
    //     const maxValue = 22;
    //     this.gridService.increaseTileSize(step, step, maxValue);
    // }

    // decreaseSize() {
    //     const step = -1;
    //     const maxValue = 13;
    //     this.gridService.decreaseTileSize(step, step, maxValue);
    // }

    // onSubmitExchange(selectionType: SelectionType) {
    //     // this.receptor = this.playAreaComponent.rackCanvas.nativeElement;
    //     console.log('submit exchange', selectionType);
    //     this.getSelectionType(selectionType);
    //     this.command = this.exchangeService.buildExchangeCommand(this.gameService.players[0].rack);
    //     this.chatboxComponent.inputBox = this.command;
    //     this.chatboxComponent.fromSelection = true;
    //     this.chatboxComponent.onSubmit();
    // }
    // onCancelManipulation(selectionType: SelectionType) {
    //     this.getSelectionType(selectionType);
    //     //  this.receptor = this.playAreaComponent.rackCanvas.nativeElement;
    //     this.rackLettersManipulationService.cancelManipulation();
    // }

    // disableManipulation() {
    //     return this.rackLettersManipulationService.selectedIndexes.length === 0;
    // }
    // disableExchange() {
    //     return this.exchangeService.selectedIndexes.length === 0 || this.reserveService.getQuantityOfAvailableLetters() < ExchangeLimits.Max;
    // }

    // onCancelExchange(selectionType: SelectionType) {
    //     this.selectionManager.getSelectionType(selectionType);
    //     this.receptor = this.playAreaComponent.rackCanvas.nativeElement;
    //     this.exchangeService.cancelExchange();
    // }
}
