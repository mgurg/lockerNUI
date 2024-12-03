import { OpenAPI } from "@/client";
import {client} from "@/clienth/sdk.gen.ts";
export default defineNuxtPlugin((nuxtApp) => {
    if (process.server) {
        // const cookie = useCookie("access_token_cookie");
        // const refreshToken = useCookie("refresh_token_cookie");
        // OpenAPI.HEADERS = {
        //     Cookie: `access_token_cookie=${cookie.value}; refresh_token_cookie=${refreshToken.value}`,
        // };
    }

    // defineNuxtPlugin baseURL
    client.setConfig({
        baseURL: 'http://localhost:5000',
        timeout: 30000,
    });

    client.instance.interceptors.request.use((config) => {
        config.headers.set('Authorization', 'Bearer XXX');
        return config;
    });

    OpenAPI.BASE =
        process.env.NODE_ENV === "development"
            ? "http://localhost:5000"
            : process.server
                ? "http://api:5000"
                : "";
    OpenAPI.WITH_CREDENTIALS = true;
});