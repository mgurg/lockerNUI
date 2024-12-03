/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Option } from './Option';
import type { WrongFeedback } from './WrongFeedback';
export type CurrentPuzzleResponse = {
    scenario: string;
    base_hint: string;
    options: Array<Option>;
    correct: number;
    result: string;
    wrong_feedback: Array<WrongFeedback>;
};

