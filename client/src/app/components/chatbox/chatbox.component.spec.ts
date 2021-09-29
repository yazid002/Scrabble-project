import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommandError } from '@app/classes/command-errors/command-error';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';
import { of } from 'rxjs';
import { ChatboxComponent } from './chatbox.component';

describe('ChatboxComponent', () => {
    let component: ChatboxComponent;
    let fixture: ComponentFixture<ChatboxComponent>;
    let commandExecutionServiceSpy: jasmine.SpyObj<CommandExecutionService>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;
    beforeEach(async () => {
        // Utilisation de spy au lieu d'appeler les services directement
        commandExecutionServiceSpy = jasmine.createSpyObj('CommandExecutionService', ['interpretCommand', 'executeCommand', 'addLetterInReserve']);
        chatServiceSpy = jasmine.createSpyObj('ChatService', ['addMessage', 'getMessages']);
        chatServiceSpy.messages = [];
        chatServiceSpy.getMessages.and.returnValue(of(chatServiceSpy.messages));
        chatServiceSpy.addMessage.and.callFake((newMessage) => chatServiceSpy.messages.push(newMessage));

        await TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
            providers: [
                CommandExecutionService,
                ChatService,
                { provide: CommandExecutionService, useValue: commandExecutionServiceSpy },
                { provide: ChatService, useValue: chatServiceSpy },
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
        // Ici, tu n'as pas besoin de vérifier si interpretCommand retourne bien une erreur quand tu mets une commande invalide car
        // c'est normalement déjà testé dans le fichier de CommandExecutionService
        // Tu dois juste tester que lorsque interpretCommand te retourne une erreur, le comportement attendu de ta fonction validateFormat est obtenu
        // c'est à dire que ça met bien ton error à true.
        // Si tu tiens à tester le bon comportement de interpretCommand, tu peux faire un fake de la vraie fonction interpretCommand
        // avec le meme contenu que la vraie, ou alors au lieu de faire un spy dessus tu appelles directement le service (déconseillé).
        // En général, quand tu as des services injectés, soit tu fake leur comportement, soit tu vérifies juste si leurs fonctions ont bien
        // été appelée car normalement elles ont été testées dans le .spec des services en question.
        // Tu peux voir sur la branche main le test qui avait été fait au départ pour le main-page qui utilisait le communicationService.
        // Je lance une erreur pour rentrer dans le catch et tester le if
        commandExecutionServiceSpy.interpretCommand.and.throwError(new CommandError('erreur de test.'));
        component.validateFormat();
        expect(component.error).toBeTrue();
    });

    it('validateFormat should not have any errors if a valid command is entered', () => {
        component.inputBox = '!debug';
        // idem que pour le test précédent, je mock que interpret command ne lance pas d'erreur et je verifie que mon error reste à false
        commandExecutionServiceSpy.interpretCommand.and.returnValue(void '');
        component.validateFormat();
        expect(component.error).toBeFalse();
    });

    it('validateFormat should not add error message when commandExecutionServiceSpy.interpretCommand does not throw a command error', async () => {
        component.inputBox = '!resersve';
        // Je mock que executeCommand lance une erreur pour rentrer dans le catch et tester le contraire du if
        commandExecutionServiceSpy.interpretCommand.and.throwError(new Error('erreur de test.'));
        component.validateFormat();
        expect(component.error).toBeFalse();
    });

    it('validateFormat should call commandExecutionServiceSpy.interpretCommand if the body starts with !', () => {
        const executedTimes = 1;
        component.inputBox = '!resersve';
        component.validateFormat();
        expect(commandExecutionServiceSpy.interpretCommand).toHaveBeenCalledTimes(executedTimes);
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
        // Je mock que executeCommand lance une erreur pour rentrer dans le catch et tester le if
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
        // Je mock que executeCommand lance une erreur pour rentrer dans le catch et tester le contraire du if
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
});
