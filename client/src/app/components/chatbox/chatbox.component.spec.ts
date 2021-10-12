import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommandError } from '@app/classes/command-errors/command-error';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';
import { GameService } from '@app/services/game.service';
import { of } from 'rxjs';
import { ChatboxComponent } from './chatbox.component';

describe('ChatboxComponent', () => {
    let component: ChatboxComponent;
    let fixture: ComponentFixture<ChatboxComponent>;
    let commandExecutionServiceSpy: jasmine.SpyObj<CommandExecutionService>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(async () => {
        // Utilisation de spy au lieu d'appeler les services directement
        commandExecutionServiceSpy = jasmine.createSpyObj('CommandExecutionService', ['interpretCommand', 'executeCommand', 'addLetterInReserve']);
        chatServiceSpy = jasmine.createSpyObj('ChatService', ['addMessage', 'getMessages']);
        chatServiceSpy.messages = [];
        chatServiceSpy.getMessages.and.returnValue(of(chatServiceSpy.messages));
        chatServiceSpy.addMessage.and.callFake((newMessage) => chatServiceSpy.messages.push(newMessage));
        gameServiceSpy = jasmine.createSpyObj('gameService', ['changeTurn', 'randomTurnSelect']);

        await TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
            providers: [
                CommandExecutionService,
                ChatService,
                { provide: CommandExecutionService, useValue: commandExecutionServiceSpy },
                { provide: ChatService, useValue: chatServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
            imports: [BrowserAnimationsModule, MatCardModule, FormsModule, MatInputModule, MatIconModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('validateFormat should detect an error if an invalid command is in inputBox property', () => {
        component.inputBox = '!invalide';
        commandExecutionServiceSpy.interpretCommand.and.throwError(new CommandError('erreur de test.'));
        component.validateFormat();
        expect(component.error).toBeTrue();
    });

    it('validateFormat should not have any errors if a valid command is entered', () => {
        component.inputBox = '!debug';
        gameServiceSpy.currentTurn = 0;
        commandExecutionServiceSpy.interpretCommand.and.returnValue(void '');
        component.validateFormat();
        expect(component.error).toBeFalse();
    });

    it('validateFormat should not add error message when commandExecutionServiceSpy.interpretCommand does not throw a command error', async () => {
        component.inputBox = '!resersve';
        gameServiceSpy.currentTurn = 0;
        commandExecutionServiceSpy.interpretCommand.and.throwError(new Error('erreur de test.'));
        component.validateFormat();
        expect(component.error).toBeFalse();
    });

    it('validateFormat should call commandExecutionServiceSpy.interpretCommand if the body starts with !', () => {
        const executedTimes = 1;
        gameServiceSpy.currentTurn = 0;
        component.inputBox = '!resersve';
        component.validateFormat();
        expect(commandExecutionServiceSpy.interpretCommand).toHaveBeenCalledTimes(executedTimes);
    });

    it('validateFormat should return error message if not your turn', () => {
        gameServiceSpy.currentTurn = 1;
        component.inputBox = '!resersve';
        component.validateFormat();
        const expectedResult = 'Attendez votre tour';
        expect(component.errorMessage).toContain(expectedResult);
        expect(component.error).toBeTrue();
    });

    // On teste le contraire du if
    it('validateFormat should not call commandExecutionServiceSpy.interpretCommand if the body does not start with !', () => {
        component.inputBox = 'resersve';
        component.validateFormat();
        expect(commandExecutionServiceSpy.interpretCommand).not.toHaveBeenCalled();
    });

    it('onSubmit should add a message to the message list onSubmit', async () => {
        component.inputBox = 'Une valeur';
        const numMessageInit: number = component.messages.length;
        await component.onSubmit();
        expect(chatServiceSpy.addMessage).toHaveBeenCalled();
        expect(component.messages.length).toEqual(numMessageInit + 1);
    });

    it('onSubmit should add two messages to the message list onSubmit if input is a command', async () => {
        component.inputBox = '!resersve';
        const numMessageInit: number = component.messages.length;
        await component.onSubmit();
        expect(component.messages.length).toEqual(numMessageInit + 2);
    });

    it('onSubmit should call commandExecutionServiceSpy.executeCommand if the body starts with !', async () => {
        const executedTimes = 1;
        component.inputBox = '!resersve';
        await component.onSubmit();
        expect(commandExecutionServiceSpy.executeCommand).toHaveBeenCalledTimes(executedTimes);
    });

    it('onSubmit should add error message when commandExecutionServiceSpy.executeCommand throw a command error', async () => {
        component.inputBox = '!resersve';
        commandExecutionServiceSpy.executeCommand.and.throwError(new CommandError('erreur de test.'));
        await component.onSubmit();
        const expectedResult = {
            from: component.possibleSenders.computer,
            body: 'Erreur de commande : erreur de test.',
        };
        expect(component.messages).toContain(expectedResult);
    });

    it('onSubmit should call chatServiceSpy.addMessage 2 times if the body starts with !', async () => {
        const executedTimes = 2;
        component.inputBox = '!resersve';
        await component.onSubmit();
        expect(chatServiceSpy.addMessage).toHaveBeenCalledTimes(executedTimes);
    });

    it('onSubmit should not add error message when commandExecutionServiceSpy.executeCommand does not throw a command error', async () => {
        component.inputBox = '!resersve';
        commandExecutionServiceSpy.executeCommand.and.throwError(new Error('erreur de test.'));
        await component.onSubmit();
        const expectedResult = {
            from: component.possibleSenders.computer,
            body: 'Erreur : erreur de test.',
        };
        expect(component.messages).not.toContain(expectedResult);
    });

    it('scrollDown should adapt the scrolling if container exists', async () => {
        const container = {
            scrollTop: 1,
            scrollHeight: 1,
            scrollTo: () => void '',
        } as HTMLElement;
        spyOn(document, 'getElementById').and.returnValue(container);

        const scrollToSpy = spyOn(container, 'scrollTo').and.callThrough();

        // Car scrollDown est privée
        // eslint-disable-next-line dot-notation
        component['scrollDown']();

        expect(scrollToSpy).toHaveBeenCalledTimes(1);
    });

    it('scrollDown should not adapt the scrolling if container does not exists', async () => {
        const container = {
            scrollTop: 1,
            scrollHeight: 1,
            scrollTo: () => void '',
        } as HTMLElement;
        spyOn(document, 'getElementById').and.returnValue(null);

        const scrollToSpy = spyOn(container, 'scrollTo').and.callThrough();

        // Car scrollDown est privée
        // eslint-disable-next-line dot-notation
        component['scrollDown']();

        expect(scrollToSpy).not.toHaveBeenCalledTimes(1);
    });
    it('should return an errorMessage if the message length is not valid', () => {
        component.inputBox = ''; // longueur de '' est 0 et la taille minimale est 1
        component.validateFormat();
        expect(component.error).toEqual(true);
    });
});
