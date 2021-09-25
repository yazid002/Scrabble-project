export interface IOption {
    name: string;
    displayName: string;
}

export interface IOptionList {
    name: string;
    displayName: string;
    required?: boolean;
    options: IOption[];
}
const MODES: IOptionList = {
    name: 'gameMode',
    displayName: 'Mode de jeux',
    required: true,
    options: [
        {
            name: 'classic',
            displayName: 'Classique',
        },
        {
            name: 'LOG2990',
            displayName: 'LOG2990',
        },
    ],
};

const NUM_PLAYERS: IOptionList = {
    name: 'numPlayers',
    displayName: 'Nombre de joueurs',
    required: true,
    options: [
        {
            name: 'multi',
            displayName: 'Multijoueur',
        },
        {
            name: 'solo',
            displayName: 'Solo',
        },
    ],
};

const COMPUTER_LEVEL: IOptionList = {
    name: 'computerLevel',
    displayName: "Niveau de l'ardinateur",
    required: true,
    options: [
        {
            name: 'easy',
            displayName: 'Débutant',
        },
    ],
};

export interface IPattern {
    rule: RegExp;
    errorMessage: string;
}
export interface ITextChoice {
    name: string;
    displayName: string;
    allowedPattern: IPattern[];
}

export const NAME_OPTION: ITextChoice = {
    name: 'name',
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
