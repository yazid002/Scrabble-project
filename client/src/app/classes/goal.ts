export interface Goal {
    description: string;
    bonus: number;
    complete: boolean;
    command: (word: string) => boolean;
}
