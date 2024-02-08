import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";

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
        const recordsElement = document.getElementById('records');
        for (let i = 0; i < freelancers.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerText = freelancers[i].avatar ?
                '<img src="' +config.host + freelancers[i].avatar + '" alt = "User Image">' : '';
            trElement.insertCell().innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            trElement.insertCell().innerText = freelancers[i].email;

            switch (freelancers[i].level) {
                case config.freelancerLevels.junior:
                    break;
                case config.freelancerLevels.middle:
                    break;
                case config.freelancerLevels.senior:
                    break;

            }
        }
        console.log(freelancers)
    }
}