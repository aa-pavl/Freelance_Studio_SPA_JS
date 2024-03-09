import {HttpUtils} from "../utils/http-utils";

export class OrdersService {
    static async getOrders() {
        const returnObj = {
            error: false,
            redirect: null,
            orders: null,
        };

        const result = await HttpUtils.request('/orders');
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.orders))) {
            returnObj.error = "Возникла ошибка при запросе заказов. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        returnObj.orders = res_response.orders;
        return returnObj;
    }

    static async getOrder(id) {
        const returnObj = {
            error: false,
            redirect: null,
            order: null,
        };

        const result = await HttpUtils.request('/orders/' + id);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.orders))) {
            returnObj.error = "Возникла ошибка при запросе заказа. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        returnObj.order = res_response;
        return returnObj;
    }

    static async createOrders(data) {
        const returnObj = {
            error: false,
            redirect: null,
            id: null,
        };

        const result = await HttpUtils.request('/orders', 'POST', true, data);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.orders))) {
            returnObj.error = "Возникла ошибка при добавление заказа. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        returnObj.id = res_response.id;
        return returnObj;
    }

    static async deleteOrder(id) {
        const returnObj = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/orders/' + id, 'DELETE', true);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.orders))) {
            returnObj.error = "Возникла ошибка при удаление заказа. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        return returnObj;
    }

    static async updateOrder(id, data) {
        const returnObj = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/orders/' + id, 'PUT', true, data);
        const res_response = result.response;
        if (result.redirect || res_response.error ||
            !res_response || (res_response && (res_response.error || !res_response.orders))) {
            returnObj.error = "Возникла ошибка при редактировании заказа. Обратитесь в поддержку.";

            if (result.redirect) {
                returnObj.redirect = result.redirect;
            }
            return returnObj;
        }
        return returnObj;
    }
}