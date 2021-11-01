import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { PlacementParameters } from '@app/classes/placement';
import { PLAYER } from '@app/classes/player';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { ExchangeLimits } from '@app/enums/exchange-enums';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { SelectionType } from '@app/enums/selection-enum';
import { Subscription } from 'rxjs';
import { ExchangeSelectionService } from './exchange-selection.service';
import { GameService } from './game.service';
import { PlaceSelectionService } from './place-selection.service';
import { RackLettersManipulationService } from './rack-letters-manipulation.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionManagerService {
    selectionType = SelectionType.Chat;
    chatboxComponent: ChatboxComponent;
    command = '';
    timerDone: Subscription;

    onLeftClickSelectionTypeMapping: Map<SelectionType, (event?: MouseEvent) => void>;

    constructor(
        private exchangeSelectionService: ExchangeSelectionService,
        private reserveService: ReserveService,
        private readonly rackService: RackService,
        private rackLettersManipulationService: RackLettersManipulationService,
        private placeSelectionService: PlaceSelectionService,
        private timerService: TimerService,

        private gameService: GameService,
    ) {
        this.onLeftClickSelectionTypeMapping = new Map([
            [SelectionType.Grid, (event?: MouseEvent) => this.handleGridSelectionOnLeftClick(event as MouseEvent)],
            [SelectionType.Rack, (event?: MouseEvent) => this.handleRackSelectionOnLeftClick(event as MouseEvent)],
            [SelectionType.None, () => this.handleNoneSelectionOnLeftClick()],
        ]);
        this.timerDone = this.timerService.timerDone.subscribe(() => {
            console.log('timer is done ', this.gameService.players[this.gameService.currentTurn]);
            console.log(this.gameService.currentTurn);
            this.placeSelectionService.cancelPlacement();
            // const turn = this.gameService.currentTurn === 1 ? 0 : 1;

            // if (this.gameService.players[turn].placementParameters) {
            //     this.placeSelectionService.cancelPlacement(this.gameService.players[turn]);
            // }
        });
    }

    getSelectionType(selectionTypeSelected: SelectionType) {
        this.selectionType = selectionTypeSelected;
    }

    onLeftClick(event: MouseEvent) {
        const placementParameters = this.gameService.players[0].placementParameters as PlacementParameters;
        console.log('placement ', placementParameters.selectedRackIndexesForPlacement, tiles);
        const selectionHandler = this.onLeftClickSelectionTypeMapping.get(this.selectionType) as (event?: MouseEvent) => void;
        if (selectionHandler) {
            selectionHandler(event);
        } else {
            this.placeSelectionService.cancelPlacement();
            this.rackLettersManipulationService.cancelManipulation();
            this.exchangeSelectionService.cancelExchange();
        }
        // if (this.selectionType === SelectionType.Grid) {
        //     this.handleGridSelectionOnLeftClick(event);
        // } else if (this.selectionType === SelectionType.Rack) {
        //     this.handleRackSelectionOnLeftClick(event);
        // } else {
        //     this.placeSelectionService.cancelPlacement(this.gameService.players[0]);
        //     this.rackLettersManipulationService.cancelManipulation();
        //     if (this.selectionType === SelectionType.None) {
        //         this.handleNoneSelectionOnLeftClick();
        //     }
        // }
    }

    handleGridSelectionOnLeftClick(event: MouseEvent) {
        console.log('this.gameService.currentTurn ', this.gameService.currentTurn);
        if (this.gameService.currentTurn !== PLAYER.realPlayer) {
            return;
        }
        this.placeSelectionService.onBoardClick(event, true);
        this.exchangeSelectionService.cancelExchange();
        this.rackLettersManipulationService.cancelManipulation();
    }

    handleRackSelectionOnLeftClick(event: MouseEvent) {
        // si on est pas en train de selectionner pour echange, on peut selectionner pour manipulation
        if (!this.exchangeSelectionService.isSelectionInProgress()) {
            this.placeSelectionService.cancelPlacement();
            this.rackLettersManipulationService.onMouseLeftClick(event, this.gameService.players[0].rack);
        }
    }

    handleNoneSelectionOnLeftClick() {
        this.placeSelectionService.cancelPlacement();
        this.rackLettersManipulationService.cancelManipulation();
        if (!this.exchangeSelectionService.isSelectionInProgress()) {
            this.selectionType = SelectionType.Rack;
        } else {
            this.exchangeSelectionService.cancelExchange();
        }
    }

    onRightClick(event: MouseEvent) {
        event.preventDefault();
        console.log('le selection type ', this.selectionType);
        if (this.selectionType !== SelectionType.Rack) {
            this.exchangeSelectionService.cancelExchange();
        } else {
            // si la lettre qu'on veut selectionner est deja selectionnee pour manipulation, elle devient selectionnee pour echange
            if (
                this.rackLettersManipulationService
                    .getSelectedLetters(this.gameService.players[0].rack)
                    .includes(
                        this.gameService.players[this.gameService.currentTurn].rack[
                            this.rackLettersManipulationService.getMouseClickIndex(event, this.gameService.players[this.gameService.currentTurn].rack)
                        ].name.toLowerCase(),
                    )
            ) {
                this.rackLettersManipulationService.cancelManipulation();
            }

            this.rackLettersManipulationService.cancelManipulation();
            this.exchangeSelectionService.onMouseRightClick(event, this.gameService.players[0].rack);
        }
    }

    onKeyBoardClick(event: KeyboardEvent) {
        if (this.selectionType === SelectionType.Grid) {
            this.handleGridSelectionOnKeyBoardClick(event);
        } else if (this.selectionType === SelectionType.Rack) {
            this.handleRackSelectionOnKeyBoardClick(event);
        }
    }

    handleGridSelectionOnKeyBoardClick(event: KeyboardEvent) {
        // On ne peut pas placer si ce n'est pas notre tour
        if (this.gameService.currentTurn !== PLAYER.realPlayer) {
            return;
        }
        //     const placementParameters = this.gameService.players[0].placementParameters as PlacementParameters;
        const isPlacementCanceled =
            event.key === KeyboardKeys.Escape ||
            (event.key === KeyboardKeys.Backspace && this.placeSelectionService.selectedTilesForPlacement.length <= 1);
        if (isPlacementCanceled) {
            this.selectionType = SelectionType.Rack;
        }
        this.placeSelectionService.onKeyBoardClick(event, this.gameService.players[0].rack);
        if (event.key === KeyboardKeys.Enter) {
            console.log('ici Enter ');
            this.submitPlacement();
        }
    }

    handleRackSelectionOnKeyBoardClick(event: KeyboardEvent) {
        console.log('ici manipulation');
        const isRackSelectedForManipulation =
            this.rackService.isLetterOnRack(event.key) || event.key === KeyboardKeys.ArrowRight || event.key === KeyboardKeys.ArrowLeft;
        if (isRackSelectedForManipulation) {
            this.rackLettersManipulationService.onKeyBoardClick(event, this.gameService.players[0].rack);
        } else {
            this.rackLettersManipulationService.cancelManipulation();
        }
    }

    onMouseWheel(event: WheelEvent) {
        if (this.selectionType === SelectionType.Rack) {
            let keyEvent: KeyboardEvent;
            if (event.deltaY > 0) {
                keyEvent = {
                    key: KeyboardKeys.ArrowRight,
                    preventDefault: () => void '',
                } as KeyboardEvent;
            } else {
                keyEvent = { key: KeyboardKeys.ArrowLeft, preventDefault: () => void '' } as KeyboardEvent;
            }

            this.onKeyBoardClick(keyEvent);
        }
    }

    onCancelManipulation(selectionType: SelectionType) {
        this.getSelectionType(selectionType);
        this.rackLettersManipulationService.cancelManipulation();
    }

    disableManipulation() {
        return this.rackLettersManipulationService.selectedIndexes.length === 0;
    }

    disableExchange() {
        return this.exchangeSelectionService.selectedIndexes.length === 0 || this.reserveService.getQuantityOfAvailableLetters() < ExchangeLimits.Max;
    }

    onCancelExchange(selectionType: SelectionType) {
        this.getSelectionType(selectionType);
        this.exchangeSelectionService.cancelExchange();
    }

    onSubmitExchange(selectionType: SelectionType) {
        this.getSelectionType(selectionType);
        this.command = this.exchangeSelectionService.buildExchangeCommand(this.gameService.players[this.gameService.currentTurn].rack);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }

    onSubmitPlacement(selectionType: SelectionType) {
        this.getSelectionType(selectionType);
        const keyEvent = {
            key: KeyboardKeys.Enter,
            preventDefault: () => void '',
        } as KeyboardEvent;
        this.onKeyBoardClick(keyEvent);
    }

    disablePlacement() {
        // const placementParameters = this.gameService.players[0].placementParameters;
        // if (!placementParameters) {
        //     return false;
        // }
        return this.placeSelectionService.selectedRackIndexesForPlacement.length === 0;
    }

    onCancelPlacement(selectionType: SelectionType) {
        this.getSelectionType(selectionType);
        const keyEvent = {
            key: KeyboardKeys.Escape,
            preventDefault: () => void '',
        } as KeyboardEvent;
        this.onKeyBoardClick(keyEvent);
    }

    submitPlacement() {
        this.command = this.placeSelectionService.command;
        console.log('la commande ici', this.command);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }
}
