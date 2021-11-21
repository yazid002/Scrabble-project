import { Injectable } from '@angular/core';
import { PLAYER } from '@app/classes/player';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { NOT_FOUND } from '@app/constants/common-constants';
import { EXCHANGE_MAX_LIMIT } from '@app/constants/exchange-constants';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { OperationType, SelectionType } from '@app/enums/selection-enum';
import { Subscription } from 'rxjs';
import { ExchangeSelectionService } from './exchange-selection.service';
import { GameService } from './game.service';
import { PlaceSelectionService } from './place-selection.service';
import { RackLettersManipulationService } from './rack-letters-manipulation.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';
import { SelectionUtilsService } from './selection-utils.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionManagerService {
    selectionType: SelectionType;
    chatboxComponent: ChatboxComponent;
    command: string;
    timerDone: Subscription;

    onLeftClickSelectionTypeMapping: Map<SelectionType, (event?: MouseEvent) => void>;
    onKeyBoardClickSelectionTypeMapping: Map<SelectionType, (event?: KeyboardEvent) => void>;

    constructor(
        private exchangeSelectionService: ExchangeSelectionService,
        private reserveService: ReserveService,
        readonly rackService: RackService,
        private rackLettersManipulationService: RackLettersManipulationService,
        private placeSelectionService: PlaceSelectionService,
        private timerService: TimerService,
        private selectionUtilsService: SelectionUtilsService,
        private gameService: GameService,
    ) {
        this.selectionType = SelectionType.Chat;
        this.command = '';
        this.onLeftClickSelectionTypeMapping = new Map([
            [SelectionType.Grid, (event?: MouseEvent) => this.handleGridSelectionOnLeftClick(event as MouseEvent)],
            [SelectionType.Rack, (event?: MouseEvent) => this.handleRackSelectionOnLeftClick(event as MouseEvent)],
            [SelectionType.None, () => this.handleNoneSelectionOnLeftClick()],
        ]);
        this.onKeyBoardClickSelectionTypeMapping = new Map([
            [SelectionType.Grid, (event?: KeyboardEvent) => this.handleGridSelectionOnKeyBoardClick(event as KeyboardEvent)],
            [SelectionType.Rack, (event?: KeyboardEvent) => this.handleRackSelectionOnKeyBoardClick(event as KeyboardEvent)],
        ]);
        this.timerDone = this.timerService.timerDone.subscribe(() => {
            this.placeSelectionService.cancelPlacement();
        });
    }

    updateSelectionType(selectionTypeSelected: SelectionType): void {
        this.selectionType = selectionTypeSelected;
    }

    onLeftClick(event: MouseEvent) {
        const selectionHandler = this.onLeftClickSelectionTypeMapping.get(this.selectionType) as (event?: MouseEvent) => void;
        if (selectionHandler) {
            selectionHandler(event);
        } else {
            this.placeSelectionService.cancelPlacement();
            this.rackLettersManipulationService.cancelManipulation();
            this.exchangeSelectionService.cancelExchange();
        }
    }
    onRightClick(event: MouseEvent) {
        event.preventDefault();
        if (this.selectionType !== SelectionType.Rack) {
            this.exchangeSelectionService.cancelExchange();
        } else {
            this.rackLettersManipulationService.cancelManipulation();
            this.exchangeSelectionService.onMouseRightClick(event, this.gameService.players[PLAYER.realPlayer].rack);
        }
    }

    onKeyBoardClick(event: KeyboardEvent) {
        const selectionHandler = this.onKeyBoardClickSelectionTypeMapping.get(this.selectionType) as (event?: KeyboardEvent) => void;
        if (!selectionHandler) {
            return;
        }
        selectionHandler(event);
    }

    onMouseWheel(event: WheelEvent) {
        if (this.selectionType !== SelectionType.Rack) {
            return;
        }
        const keyEvent: KeyboardEvent =
            event.deltaY > 0
                ? ({ key: KeyboardKeys.ArrowRight, preventDefault: () => void '' } as KeyboardEvent)
                : ({ key: KeyboardKeys.ArrowLeft, preventDefault: () => void '' } as KeyboardEvent);

        this.onKeyBoardClick(keyEvent);
    }

    onCancelManipulation(selectionType: SelectionType) {
        this.updateSelectionType(selectionType);
        this.rackLettersManipulationService.cancelManipulation();
    }

    disableManipulation() {
        return this.rackLettersManipulationService.selectedIndexes.length === 0;
    }

    disableExchange() {
        const itSMyTurn = this.gameService.currentTurn === PLAYER.realPlayer;
        return !itSMyTurn || this.reserveService.getQuantityOfAvailableLetters() < EXCHANGE_MAX_LIMIT;
    }

    hideExchangeButton() {
        return this.exchangeSelectionService.selectedIndexes.length === 0;
    }

    onCancelExchange(selectionType: SelectionType) {
        this.updateSelectionType(selectionType);
        this.exchangeSelectionService.cancelExchange();
    }

    onSubmitExchange(selectionType: SelectionType) {
        this.updateSelectionType(selectionType);
        this.command = this.exchangeSelectionService.buildExchangeCommand(this.gameService.players[PLAYER.realPlayer].rack);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }

    onSubmitPlacement(selectionType: SelectionType) {
        this.updateSelectionType(selectionType);
        const keyEvent = {
            key: KeyboardKeys.Enter,
            preventDefault: () => void '',
        } as KeyboardEvent;
        this.onKeyBoardClick(keyEvent);
    }

    hideOperation(operationType: OperationType): boolean {
        if (operationType === OperationType.Place) {
            return this.placeSelectionService.hideOperation();
        } else if (operationType === OperationType.Exchange) {
            return this.exchangeSelectionService.hideOperation();
        }
        return true;
    }

    onCancelPlacement(selectionType: SelectionType) {
        this.updateSelectionType(selectionType);
        const keyEvent = {
            key: KeyboardKeys.Escape,
            preventDefault: () => void '',
        } as KeyboardEvent;
        this.onKeyBoardClick(keyEvent);
    }

    private activePlacement() {
        this.command = this.placeSelectionService.command;
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }
    private handleGridSelectionOnKeyBoardClick(event: KeyboardEvent) {
        const itSMyTurn = this.gameService.currentTurn === PLAYER.realPlayer;
        // On ne peut pas placer si ce n'est pas notre tour
        if (!itSMyTurn) {
            this.updateSelectionType(SelectionType.Rack);
            return;
        }
        const isPlacementCancelled =
            event.key === KeyboardKeys.Escape ||
            (event.key === KeyboardKeys.Backspace && this.placeSelectionService.selectedTilesForPlacement.length <= 1);
        if (isPlacementCancelled) {
            this.updateSelectionType(SelectionType.Rack);
        }
        this.placeSelectionService.onKeyBoardClick(event, this.gameService.players[PLAYER.realPlayer].rack);
        if (event.key === KeyboardKeys.Enter) {
            this.activePlacement();
        }
    }

    private handleGridSelectionOnLeftClick(event: MouseEvent) {
        if (this.gameService.currentTurn !== PLAYER.realPlayer) {
            this.updateSelectionType(SelectionType.Rack);
            return;
        }
        this.placeSelectionService.onBoardClick(event, true);
        this.exchangeSelectionService.cancelExchange();
        this.rackLettersManipulationService.cancelManipulation();
    }

    private handleRackSelectionOnLeftClick(event: MouseEvent) {
        // si on est pas en train de selectionner pour echange, on peut selectionner pour manipulation
        const letterIsAlreadySelectedForExchange = this.isLetterClickAlreadySelectedForExchange(event);
        if (!letterIsAlreadySelectedForExchange) {
            this.exchangeSelectionService.cancelExchange();
            this.placeSelectionService.cancelPlacement();
            this.rackLettersManipulationService.onMouseLeftClick(event, this.gameService.players[PLAYER.realPlayer].rack);
        }
    }

    private handleNoneSelectionOnLeftClick() {
        this.placeSelectionService.cancelPlacement();
        this.rackLettersManipulationService.cancelManipulation();
        if (this.exchangeSelectionService.hideOperation()) {
            this.selectionType = SelectionType.Rack;
        } else {
            this.exchangeSelectionService.cancelExchange();
        }
    }

    private handleRackSelectionOnKeyBoardClick(event: KeyboardEvent) {
        const isRackSelectedForManipulation = event.key === KeyboardKeys.ArrowRight || event.key === KeyboardKeys.ArrowLeft || event.key === 'Shift';

        if (isRackSelectedForManipulation) {
            this.rackLettersManipulationService.onKeyBoardClick(event, this.gameService.players[PLAYER.realPlayer].rack);
        } else if (!this.isLetterKeyAlreadySelectedForExchange(event)) {
            this.exchangeSelectionService.cancelExchange();
            this.rackLettersManipulationService.onKeyBoardClick(event, this.gameService.players[PLAYER.realPlayer].rack);
        } else {
            this.rackLettersManipulationService.cancelManipulation();
        }
    }

    private isLetterKeyAlreadySelectedForExchange(event: KeyboardEvent): boolean {
        const index = this.rackLettersManipulationService.getIndexFromKey(event, this.gameService.players[PLAYER.realPlayer].rack);
        return index === NOT_FOUND ? false : this.exchangeSelectionService.isLetterAlreadySelected(index);
    }

    private isLetterClickAlreadySelectedForExchange(event: MouseEvent): boolean {
        const index = this.selectionUtilsService.getMouseClickIndex(event, this.gameService.players[PLAYER.realPlayer].rack);
        return index === NOT_FOUND ? false : this.exchangeSelectionService.isLetterAlreadySelected(index);
    }
}
