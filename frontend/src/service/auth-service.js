import {HttpUtils} from "../utils/http-utils";

export class AuthService {
    static async getFreelancers() {
        const returnObj = {
            error: false,
            redirect: null,
            freelancers: null,
        };

        const result = await HttpUtils.request('/freelancers');
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.freelancers))) {
            returnObj.error = "Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        returnObj.freelancers = res_response.freelancers;
        return returnObj;
    }

    static async logIn(data) {
        const result = await HttpUtils.request('/login', 'POST', false, data);

        const res_response = result.response;
        if (result.error || !res_response ||
            (res_response && (!res_response.accessToken|| !res_response.refreshToken|| !res_response.id|| !res_response.name))) {
            return false;
        }
        return result.response;
    }

    static async signUp(data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);

        const res_response = result.response;
        if (result.error || !res_response ||
            (res_response && (!res_response.accessToken|| !res_response.refreshToken|| !res_response.id|| !res_response.name))) {
            return false;
        }
        return result.response;
    }

    static async logOut(data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }

}