import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IChat, SENDER } from '@app/classes/chat';
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
            imports: [BrowserAnimationsModule, MatCardModule, FormsModule, MatInputModule, MatIconModule, HttpClientModule],
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

    it('validateFormat should call commandExecutionServiceSpy.interpretCommand if the body starts with !', async () => {
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, function: () => result };
        const executedTimes = 1;
        component.inputBox = '!passer';
        commandExecutionServiceSpy.interpretCommand.and.returnValue(response);
        await component.validateFormat();

        expect(commandExecutionServiceSpy.interpretCommand).toHaveBeenCalledTimes(executedTimes);
    });
    // On teste le contraire du if
    it('validateFormat should not call commandExecutionServiceSpy.interpretCommand if the body does not start with !', async () => {
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, function: () => result };
        component.inputBox = 'resersve';
        commandExecutionServiceSpy.interpretCommand.and.returnValue(response);
        await component.validateFormat();
        expect(commandExecutionServiceSpy.interpretCommand).not.toHaveBeenCalled();
    });

    it('validateFormat should put answer.body in errorMessage if there is an error with the command', async () => {
        component.inputBox = '!resersve';
        const answer: IChat = {
            from: component.possibleSenders.computer,
            body: 'Erreur de commande : erreur de test.',
        };
        const returnValue = { error: true, function: async () => answer };
        commandExecutionServiceSpy.interpretCommand.and.returnValue(returnValue);
        await component.validateFormat();
        expect(component.errorMessage).toContain(answer.body);
        expect(component.error).toBeTrue();
    });
    it('validateFormat should set error = false if there is no error with the command', async () => {
        component.inputBox = '!resersve';
        const answer: IChat = {
            from: component.possibleSenders.computer,
            body: 'All is good',
        };
        const returnValue = { error: false, function: async () => answer };
        commandExecutionServiceSpy.interpretCommand.and.returnValue(returnValue);
        await component.validateFormat();
        expect(component.error).toBeFalse();
    });

    it('onSubmit should add a message to the message list onSubmit', async () => {
        component.inputBox = 'Une valeur';
        const numMessageInit: number = component.messages.length;
        await component.onSubmit();
        expect(chatServiceSpy.addMessage).toHaveBeenCalled();
        expect(component.messages.length).toEqual(numMessageInit + 1);
    });

    it('onSubmit should put answer in a new message if there is an error with the command', async () => {
        component.inputBox = '!resersve';
        const answer: IChat = {
            from: component.possibleSenders.computer,
            body: 'Erreur de commande : erreur de test.',
        };
        const returnValue = async () => {
            return { error: true, message: answer };
        };
        commandExecutionServiceSpy.executeCommand.and.returnValue(returnValue());
        await component.onSubmit();
        expect(component.messages).toContain(answer);
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
