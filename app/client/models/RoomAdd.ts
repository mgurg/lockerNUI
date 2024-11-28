/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationAdd } from './LocationAdd';
import type { TranslationAdd } from './TranslationAdd';
export type RoomAdd = {
    name: string;
    price_from?: (number | null);
    game_duration?: (number | null);
    players_min?: (number | null);
    players_max?: (number | null);
    reservation_url?: (string | null);
    lm_id?: (string | null);
    mt_id?: (string | null);
    location: LocationAdd;
    translation: TranslationAdd;
};

