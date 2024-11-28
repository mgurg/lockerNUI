/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GeoNameAdd } from './GeoNameAdd';
export type PlaceAdd = {
    lat: (number | string | null);
    lon: (number | string | null);
    lat_min: (number | string | null);
    lat_max: (number | string | null);
    lon_min: (number | string | null);
    lon_max: (number | string | null);
    population: (number | null);
    importance: (number | null);
    category: string;
    region: (string | null);
    country: (string | null);
    geo_names: Array<GeoNameAdd>;
};

