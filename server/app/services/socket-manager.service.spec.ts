import { SocketManager } from '@app/services/socket-manager.service';
import { expect } from 'chai';
import * as http from 'http';

describe('Socket manager service', () => {
    let service: SocketManager;
    let server: http.Server;
    beforeEach(async () => {
        server = http.createServer();
        service = new SocketManager(server);
    });

    it('should create', () => {
        expect(service).to.not.equal(undefined);
    });
});
