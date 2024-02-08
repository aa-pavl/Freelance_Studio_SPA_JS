import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";

export class FreelancersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getFreelancers().then();
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        const res_response = result.response;
        if (res_response.error || !res_response || (res_response && (res_response.error || !res_response.freelancers))) {
            return alert("Возникла ошибка при запросе фрилансеров. Обратитесь в поддержку.");
        }
        this.showRecords(res_response.freelancers)
    }

    showRecords(freelancers) {

        console.log(freelancers)
    }
}