import config from "../config/config";
import {AuthUtils} from "./auth-utils";

export class HttpUtils {
    static async request(url, method = "GET", useAuth = true, body = null) {
        const result = {
            error: false,
            response: null,
        }
        
        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let token = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['authorization'] = token;
            }
        }
        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            // страница открыта по ссылке или с устаревшим токеном
            if (useAuth && response.status === 401) {
                // 1. токена нет
                if (!token) {
                    result.redirect = ('/login');
                    return result;
                }
                // 2. токен устарел
                const updateTokenResult  = await AuthUtils.updateRefreshToken();
                if (updateTokenResult) {
                    // повторный запрос
                    return this.request(url, method, useAuth, body);
                } else {
                    result.redirect = ('/login');
                }
            }
        }
        return result;
    }
}