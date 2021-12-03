import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IChat, SENDER } from '@app/classes/chat';
import { ChatService } from './chat.service';

describe('ChatService', () => {
    let service: ChatService;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [NoopAnimationsModule] });
        service = TestBed.inject(ChatService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should add a message to the message array when addMessage is called', () => {
        const initialMessageSize = service.messages.length;
        const message: IChat = { from: SENDER.me, body: 'Hello world' };
        service.addMessage(message);
        expect(service.messages).toContain(message);

        expect(service.messages.length).toEqual(initialMessageSize + 1);
    });
    it('should clear messages when the clear() is called', () => {
        const message: IChat = { from: SENDER.me, body: 'Hello world' };
        service.messages = [message, message, message];
        service.clear();
        expect(service.messages.length).toEqual(0);
    });
    it("should not send 'messageSend' signal if message is a command", () => {
        const message: IChat = { from: SENDER.me, body: '!reserve' };
        const spy = spyOn(service.messageSent, 'next');
        service.addMessage(message);
        expect(spy).not.toHaveBeenCalled();
    });
});
