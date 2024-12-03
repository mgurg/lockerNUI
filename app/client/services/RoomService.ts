/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoomAdd } from '../models/RoomAdd';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoomService {
    /**
     * Room By Uuid
     * @param roomUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static roomByUuidRoomsRoomUuidGet(
        roomUuid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rooms/{room_uuid}',
            path: {
                'room_uuid': roomUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Room By Url Slug
     * @param language
     * @param roomUrlSlug
     * @returns any Successful Response
     * @throws ApiError
     */
    public static roomByUrlSlugRoomsUrlLanguageRoomUrlSlugGet(
        language: string,
        roomUrlSlug: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rooms/url/{language}/{room_url_slug}',
            path: {
                'language': language,
                'room_url_slug': roomUrlSlug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Rooms By Location
     * @param language
     * @param location
     * @returns any Successful Response
     * @throws ApiError
     */
    public static roomsByLocationRoomsUrlLanguagePlaceLocationGet(
        language: string,
        location: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/rooms/url/{language}/place/{location}',
            path: {
                'language': language,
                'location': location,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Department
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addDepartmentRoomsDepartmentPost(
        requestBody: RoomAdd,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rooms/department',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Room
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static addRoomRoomsPost(
        requestBody: RoomAdd,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rooms',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
