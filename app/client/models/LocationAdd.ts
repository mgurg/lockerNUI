/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LocationAdd = {
    street_address: string;
    city: string;
    state_province?: (string | null);
    postal_code?: (string | null);
    country: string;
    located_in?: (string | null);
    type?: ('company' | 'department' | 'room' | null);
    lat?: (number | null);
    lon?: (number | null);
};

