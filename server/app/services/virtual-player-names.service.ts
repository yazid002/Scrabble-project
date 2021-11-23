import { NameProperties } from '@app/classes/name-properties';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';
import { Service } from 'typedi';
import { DatabaseService, DATABASE_VIRTUAL_NAMES } from './database.service';
@Service()
export class VirtualPlayerNamesService {
    constructor(private databaseService: DatabaseService) {
        this.reset();
    }

    async getNames() {
        return this.names
            .find({})
            .toArray()
            .then((name: NameProperties[]) => {
                return name;
            });
    }

    get names(): Collection<NameProperties> {
        return this.databaseService.database.collection(DATABASE_VIRTUAL_NAMES);
    }
    async addName(name: NameProperties) {
        console.log('adding name ', name);
        const names = await this.getNames();
        const item = names.find((n: NameProperties) => n.name === name.name);
        if (!item) {
            name.default = false; // Make sure the client did not try to add a default value
            this.databaseService.addName(name);
        }
    }
    async isPlayerDefault(playerName: string): Promise<boolean> {
        return this.names.findOne({ name: playerName }).then((name: NameProperties) => {
            return name.default;
        });
    }
    async delete(playerName: NameProperties): Promise<void> {
        if (!this.isPlayerDefault(playerName.name)) {
            return this.names
                .findOneAndDelete({ name: playerName.name })
                .then((res: FindAndModifyWriteOpResultObject<NameProperties>) => {
                    if (!res.value) {
                        throw new Error('Could not find course');
                    }
                })
                .catch(() => {
                    throw new Error('Failed to delete course');
                });
        }
    }
    async reset() {

        const names = [
            { name: 'Ordi Illetré', default: true, isAdvanced: false },
            { name: 'Étudiant de la maternelle', default: true, isAdvanced: false },
            { name: 'Analphabète', default: true, isAdvanced: false },
            { name: 'Dictionnaire en Personne', default: true, isAdvanced: true },
            { name: 'Word Master', default: true, isAdvanced: true },
            { name: 'Étudiant en littérature', default: true, isAdvanced: true },
        ];
        this.databaseService.populateNames(names);
    }
}
