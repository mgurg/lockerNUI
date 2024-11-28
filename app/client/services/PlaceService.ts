/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlaceAdd } from '../models/PlaceAdd';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlaceService {
    /**
     * Place By Name
     * @param locationName
     * @param language
     * @returns any Successful Response
     * @throws ApiError
     */
    public static placeByNamePlacesLocationNameGet(
        locationName: string,
        language?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/places/{location_name}',
            path: {
                'location_name': locationName,
            },
            query: {
                'language': language,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Place By Uuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static placeByUuidPlacesGeoipGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/places/geoip',
        });
    }
    /**
     * Places With Rooms
     * @param country
     * @returns any Successful Response
     * @throws ApiError
     */
    public static placesWithRoomsPlacesGet(
        country?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/places',
            query: {
                'country': country,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Room
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static addRoomPlacesPost(
        requestBody: PlaceAdd,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/places',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
