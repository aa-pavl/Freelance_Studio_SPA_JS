import {HttpUtils} from "../../utils/http-utils";
import {UrlUtils} from "../../utils/url-utils";

export class OrdersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.deleteOrder(id).then();
    }

    async deleteOrder(id) {
        const result = await HttpUtils.request('/orders/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        const res_response = result.response;
        if (res_response.error || !res_response || (res_response && res_response.error)) {
            console.log(res_response.message);
            return alert("Возникла ошибка при удаление заказа. Обратитесь в поддержку.");
        }
        return this.openNewRoute('/orders');
    }
}