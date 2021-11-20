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
        this.names = [
            { name: 'Ordi Illetré', default: true, isAdvanced: false },
            { name: 'Étudiant de la maternelle', default: true, isAdvanced: false },
            { name: 'Analphabète', default: true, isAdvanced: false },
            { name: 'Dictionnaire en Personne', default: true, isAdvanced: true },
            { name: 'Word Master', default: true, isAdvanced: true },
            { name: 'Étudiant en littérature', default: true, isAdvanced: true },
        ];
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
    // removeName(name: string) {
    //     const itemToRemove = this.names.get(name);
    //     if (itemToRemove && !itemToRemove?.default) {
    //         this.names.delete(name);
    //     }
    // }
    reset(): void {
        this.names = this.names.filter((item) => item.default);
    }
    getNames(): NameProperties[] {
        // console.log(this.names);
        return this.names;
    }
}
