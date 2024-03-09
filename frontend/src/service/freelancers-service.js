import {HttpUtils} from "../utils/http-utils";

export class FreelancersService {
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

    static async getFreelancer(id) {
        const returnObj = {
            error: false,
            redirect: null,
            freelancer: null,
        };

        const result = await HttpUtils.request('/freelancers/' + id);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.freelancers))) {
            returnObj.error = "Возникла ошибка при запросе фрилансера. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        returnObj.freelancer = res_response;
        return returnObj;
    }

    static async createFreelancers(data) {
        const returnObj = {
            error: false,
            redirect: null,
            id: null,
        };

        const result = await HttpUtils.request('/freelancers', 'POST', true, data);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.freelancers))) {
            returnObj.error = "Возникла ошибка при добавление фрилансеров. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        returnObj.id = res_response.id;
        return returnObj;
    }

    static async deleteFreelancer(id) {
        const returnObj = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/freelancers/' + id, 'DELETE', true);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.freelancers))) {
            returnObj.error = "Возникла ошибка при удаление фрилансеров. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        return returnObj;
    }

    static async updateFreelancer(id, data) {
        const returnObj = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/freelancers/' + id, 'PUT', true, data);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.freelancers))) {
            returnObj.error = "Возникла ошибка при редактировании фрилансера. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        return returnObj;
    }
}