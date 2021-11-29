import { NameProperties } from '@app/classes/name-properties';
import { Collection} from 'mongodb';
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
        const names = await this.getNames();
        const item = names.find((n: NameProperties) => n.name === name.name);
        if (!item) {
            name.default = false; // Make sure the client did not try to add a default value
            await this.databaseService.addName(name);
        }
        return undefined;
    }
    async delete(playerName: NameProperties) {
        await this.names.findOneAndDelete({ name: playerName.name, default: false });

        return undefined;
    }
    async reset() {
        await this.databaseService.reset();
    }
}
