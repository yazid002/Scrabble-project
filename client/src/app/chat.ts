export type ChatPerson = 'HIM' | 'ME';

export const HIM: ChatPerson = 'HIM';
export const ME: ChatPerson = 'ME';

export interface IChat {
    from: ChatPerson;
    body: string;
}
