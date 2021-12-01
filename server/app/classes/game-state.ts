export interface ICharacter {
    name: string;
    quantity: number;
    points: number;
    display: string;
}

export interface Player {
    name: string;
    id: number;
    rack: ICharacter[];
    points: number;
}

export interface GameState {
    dictionaryName: string;
    players: Player[];
    alphabetReserve: ICharacter[];
    currentTurn: number;
    skipCounter: number;
    timer: number;
    grid: Case[][];
}
export interface Case {
    letter: string;
    bonus: string;
    text: string;
    oldText: string;
    style: CaseStyle;
    oldStyle: CaseStyle;
}
export interface CaseStyle {
    color: string;
    font: string;
}
