/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoomService {
    /**
     * Item Get One
     * @param roomUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static itemGetOneRoomsRoomUuidGet(
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
}
