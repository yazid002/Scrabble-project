import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PassExecutionService {
    execute(): boolean {
        return true;
    }
}
