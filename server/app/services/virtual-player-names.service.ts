import { NameProperties } from '@app/classes/name-properties';
import { Collection } from 'mongodb';
import { Service } from 'typedi';
import { DatabaseService, DATABASE_VIRTUAL_NAMES } from './database.service';
@Service()
export class VirtualPlayerNamesService {
    name: NameProperties[];
    constructor(private databaseService: DatabaseService) {
        this.reset();
    }
    get names(): Collection<NameProperties> {
        return this.databaseService.database.collection(DATABASE_VIRTUAL_NAMES);
    }
    addName(name: NameProperties): void {
        console.log('adding name ', name);
        const item = this.name.find((n) => n.name === name.name);
        if (!item) {
            name.default = false; // Make sure the client did not try to add a default value
            this.name.push(name);
            console.log(this.name);
        }
    }
    delete(name: NameProperties) {
        const index = this.name.findIndex((item) => item.name === name.name && !item.default);
        if (index !== -1) {
            console.log('deleting name ', this.name[index]);
            this.name.splice(index, 1);
        }
    }
    async reset() {
        this.name = [
            { name: 'Ordi Illetré', default: true, isAdvanced: false },
            { name: 'Étudiant de la maternelle', default: true, isAdvanced: false },
            { name: 'Analphabète', default: true, isAdvanced: false },
            { name: 'Dictionnaire en Personne', default: true, isAdvanced: true },
            { name: 'Word Master', default: true, isAdvanced: true },
            { name: 'Étudiant en littérature', default: true, isAdvanced: true },
        ];
        await this.databaseService.populateNames(this.name);
    }
}
