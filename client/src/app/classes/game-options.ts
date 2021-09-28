export interface IOption {
    key: string;
    value: string;
    disabled?: boolean;
}

export interface IOptionList {
    settingName: string;
    availableChoices: IOption[];
}

export interface IUserSetting {
    setting: IOptionList;
    currentChoiceKey: string;
}

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
