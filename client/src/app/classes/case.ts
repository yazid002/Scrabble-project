import { CaseStyle } from './case-style';
export interface Case {
    letter: string;
    bonus: string;
    text: string;
    oldText: string;
    style: CaseStyle;
    oldStyle: CaseStyle;
}
