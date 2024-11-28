/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompaniesPaginated } from '../models/CompaniesPaginated';
import type { CompanyAdd } from '../models/CompanyAdd';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CompanyService {
    /**
     * Get Companies
     * @param search
     * @param limit
     * @param offset
     * @param field
     * @param order
     * @returns CompaniesPaginated Successful Response
     * @throws ApiError
     */
    public static getCompaniesCompaniesGet(
        search?: (string | null),
        limit: number = 10,
        offset?: number,
        field: 'name' | 'created_at' = 'name',
        order: 'asc' | 'desc' = 'asc',
    ): CancelablePromise<CompaniesPaginated> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/companies',
            query: {
                'search': search,
                'limit': limit,
                'offset': offset,
                'field': field,
                'order': order,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Company
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static addCompanyCompaniesPost(
        requestBody: CompanyAdd,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/companies',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
