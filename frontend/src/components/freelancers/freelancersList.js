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
            trElement.insertCell().innerHTML = freelancers[i].avatar ?
                '<img class="freelancer-avatar" src="' + config.host + freelancers[i].avatar + '" alt = "User Image">' : '';
            trElement.insertCell().innerText = `${freelancers[i].name} ${freelancers[i].lastName}`;
            trElement.insertCell().innerText = freelancers[i].email;

            let levelHtml = null;
            switch (freelancers[i].level) {
                case config.freelancerLevels.junior:
                    levelHtml = '<span class="badge badge-info">Junior</span>';
                    break;
                case config.freelancerLevels.middle:
                    levelHtml = '<span class="badge badge-warning">Middle</span>';
                    break;
                case config.freelancerLevels.senior:
                    levelHtml = '<span class="badge badge-success">Senior</span>';
                    break;
                default:
                    levelHtml = '<span class="badge badge-secondary">Unknown</span>';
            }
            trElement.insertCell().innerHTML = levelHtml;
            trElement.insertCell().innerText = freelancers[i].education;
            trElement.insertCell().innerText = freelancers[i].location;
            trElement.insertCell().innerText = freelancers[i].skills;
            trElement.insertCell().innerHTML =
                '<div class="freelancer-tools">' +
                '<a href="/freelancers/view?id="' + freelancers[i].id + ' class="fas fa-eye"></a>' +
                '<a href="/freelancers/edit?id="' + freelancers[i].id + ' class="fas fa-edit"></a>' +
                '<a href="/freelancers/dalete?id="' + freelancers[i].id + ' class="fas fa-trash"></a>' +
                '</div>';

            recordsElement.appendChild(trElement);
        }
        console.log(freelancers)


        new DataTable('#data-table', {
            language: {
                "lengthMenu": "Показывать _MENU_ записей на странице",
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {
                    "next": "Вперед",
                    "previous": "Назад"
                },
            }
        });
    }
}