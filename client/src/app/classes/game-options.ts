export interface IOption {
    key: string;
    displayName: string;
}

export interface IOptionList {
    key: string;
    displayName: string;
    options: IOption[];
    userValueKey?: string;
}
const MODES: IOptionList = {
    key: 'gameMode',
    displayName: 'Mode de jeux',
    options: [
        {
            key: 'classic',
            displayName: 'Classique',
        },
        {
            key: 'LOG2990',
            displayName: 'LOG2990',
        },
    ],
    userValueKey: '',
};

const NUM_PLAYERS: IOptionList = {
    key: 'numPlayers',
    displayName: 'Nombre de joueurs',
    options: [
        {
            key: 'multi',
            displayName: 'Multijoueur',
        },
        {
            key: 'solo',
            displayName: 'Solo',
        },
    ],
    userValueKey: '',
};

const COMPUTER_LEVEL: IOptionList = {
    key: 'computerLevel',
    displayName: "Niveau de l'ordinateur",
    options: [
        {
            key: 'easy',
            displayName: 'Débutant',
        },
    ],
    userValueKey: '',
};

export interface IPattern {
    rule: RegExp;
    errorMessage: string;
}
export interface ITextChoice {
    key: string;
    displayName: string;
    allowedPattern: IPattern[];
    userChoice: string;
}

export const NAME_OPTION: ITextChoice = {
    key: 'name',
    displayName: "Votre nom d'utilisateur",
    allowedPattern: [
        {
            rule: /^[a-zA-Z0-9_]*$/,
            errorMessage: 'Caractères spéciaux intertits',
        },
        {
            rule: /^.{1,20}$/,
            errorMessage: 'Entre 0 et 20 caratères',
        },
    ],
    userChoice: '',
};

export const SETTINGS: {
    modes: IOptionList;
    numPlayers: IOptionList;
    computerLevel: IOptionList;
} = {
    modes: MODES,
    numPlayers: NUM_PLAYERS,
    computerLevel: COMPUTER_LEVEL,
};

export interface IUserSettings {
    name: string;
    numPlayers: string;
    gameMode: string;
    computerLevel?: string;
}
