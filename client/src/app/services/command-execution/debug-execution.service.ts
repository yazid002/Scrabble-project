import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DebugExecutionService {
    execute(): boolean {
        return true;
    }
}
