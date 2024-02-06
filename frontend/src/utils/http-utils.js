import config from "../config/config";

export class HttpUtils {
    static async request(url, metod = "GET", body = null) {
        const result = {
            error: false,
            responce: null,
        }

        const params = {
            method: metod,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };

        let responce = null;
        try {
            responce = await fetch(config.api + url, params);
            result.responce = await responce.json();
        } catch (e) {
            result.error = true;
        }
        if (body) {
            params.body = JSON.stringify(body);
            return result;
        }

        if (responce.status < 200 || responce.status >= 300) {
            result.error = true;
        }

        return result;
    }
}