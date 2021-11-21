import { Service } from 'typedi';
interface NameProperties {
    name: string;
    default: boolean;
    isAdvanced: boolean;
}
@Service()
export class VirtualPlayerNamesService {
    names: NameProperties[];
    constructor() {
        this.reset();
    }

    addName(name: NameProperties): void {
        console.log('adding name ', name);
        const item = this.names.find((n) => n.name === name.name);
        if (!item) {
            name.default = false; // Make sure the client did not try to add a default value
            this.names.push(name);
            console.log(this.names);
        }
    }
    delete(name: NameProperties) {
        const index = this.names.findIndex((item) => item.name === name.name && !item.default);
        if (index !== -1) {
            console.log('deleting name ', this.names[index]);
            this.names.splice(index, 1);
        }
    }
    reset(): void {
        this.names = [
            { name: 'Ordi Illetré', default: true, isAdvanced: false },
            { name: 'Étudiant de la maternelle', default: true, isAdvanced: false },
            { name: 'Analphabète', default: true, isAdvanced: false },
            { name: 'Dictionnaire en Personne', default: true, isAdvanced: true },
            { name: 'Word Master', default: true, isAdvanced: true },
            { name: 'Étudiant en littérature', default: true, isAdvanced: true },
        ];
    }
}
