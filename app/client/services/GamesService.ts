/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrentPuzzleResponse } from '../models/CurrentPuzzleResponse';
import type { GameStart } from '../models/GameStart';
import type { GameStartResponse } from '../models/GameStartResponse';
import type { GameState } from '../models/GameState';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GamesService {
    /**
     * Get Test
     * @param gameUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTestGamesTestGet(
        gameUuid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/test',
            query: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Post Test
     * @param gameUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static postTestGamesTestGameUuidPost(
        gameUuid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/games/test/{game_uuid}',
            path: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Start Game
     * @param requestBody
     * @returns GameStartResponse Successful Response
     * @throws ApiError
     */
    public static startGameGamesStartPost(
        requestBody: GameStart,
    ): CancelablePromise<GameStartResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/games/start',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Intro
     * @param gameUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getIntroGamesIntroGet(
        gameUuid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/intro',
            query: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Puzzle
     * @param gameUuid
     * @returns CurrentPuzzleResponse Successful Response
     * @throws ApiError
     */
    public static getPuzzleGamesPuzzleGet(
        gameUuid: string,
    ): CancelablePromise<CurrentPuzzleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/puzzle',
            query: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Submit Answer
     * @param gameUuid
     * @param choice
     * @returns any Successful Response
     * @throws ApiError
     */
    public static submitAnswerGamesAnswerPost(
        gameUuid: string,
        choice: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/games/answer',
            query: {
                'game_uuid': gameUuid,
                'choice': choice,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Hint
     * @param gameUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getHintGamesHintPost(
        gameUuid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/games/hint',
            query: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Game Status
     * @param gameUuid
     * @returns GameState Successful Response
     * @throws ApiError
     */
    public static getGameStatusGamesStatusGet(
        gameUuid: string,
    ): CancelablePromise<GameState> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/status',
            query: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Ending
     * @param gameUuid
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getEndingGamesEndingGet(
        gameUuid: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/games/ending',
            query: {
                'game_uuid': gameUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
