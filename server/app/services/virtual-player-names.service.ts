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

    // addName(name: string, isAdvanced: true): void {
    //     const item = this.names.get(name);
    //     if (!item) this.names.set(name, { default: false, isAdvanced });
    // }
    // removeName(name: string) {
    //     const itemToRemove = this.names.get(name);
    //     if (itemToRemove && !itemToRemove?.default) {
    //         this.names.delete(name);
    //     }
    // }
    getNames(): NameProperties[] {
        // console.log(this.names);
        return this.names;
    }
}
