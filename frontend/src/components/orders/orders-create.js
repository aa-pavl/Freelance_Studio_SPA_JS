import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

        this.dateScheduled = null;
        this.dateComplete = null;
        this.dateDeadline = null;
        const calendarScheduled = $('#calendar-scheduled');
        const calendarComplete = $('#calendar-complete');
        const calendarDeadline = $('#calendar-deadline');

        calendarScheduled.datetimepicker({
            // format: 'L',
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarScheduled.on("change.datetimepicker", function (e) {
            this.dateScheduled = e.date;
            console.log(this.dateScheduled)
        });
        calendarComplete.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            buttons: {
                showClear: true,
            },
            useCurrent: false,
        });
        calendarComplete.on("change.datetimepicker", function (e) {
            this.dateScheduled = e.date;
        });
        calendarDeadline.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarDeadline.on("change.datetimepicker", function (e) {
            this.dateScheduled = e.date;
        });

        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.amountInputElement = document.getElementById('amountInput');

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

        const freelancers = res_response.freelancers;
        for (let i = 0; i < freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = freelancers[i].id;
            option.innerText = freelancers[i].name + " " + freelancers[i].lastName;
            this.freelancerSelectElement.appendChild(option);
        }
        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });
    }

    validateForm() {
        let isValid = true;

        let textInput = [this.descriptionInputElement, this.amountInputElement];
        for (let i = 0; i < textInput.length; i++) {
            if (textInput[i].value) {
                textInput[i].classList.remove('is-invalid');
            } else {
                textInput[i].classList.add('is-invalid');
                isValid = false;
            }
        }



        return isValid;
    }

    saveOrder(e) {
        e.preventDefault();
        if (this.validateForm()) {
    //         const createData = {
    //             name: this.nameElement.value,
    //             lastName: this.nameLastElement.value,
    //             email: this.emailElement.value,
    //             level: this.levelElement.value,
    //             education: this.educationElement.value,
    //             location: this.locationElement.value,
    //             skills: this.skillElement.value,
    //             info: this.infoElement.value,
    //         }
    //         if (this.avatarElement.files && this.avatarElement.files.length > 0) {
    //             createData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarElement.files[0]);
    //         }
    //
    //         const result = await HttpUtils.request('/freelancers', 'POST', true, createData);
    //         if (result.redirect) {
    //             return this.openNewRoute(result.redirect);
    //         }
    //
    //         const res_response = result.response;
    //         if (res_response.error || !res_response || (res_response && res_response.error)) {
    //             console.log(res_response.message);
    //             return alert("Возникла ошибка при создание фрилансера. Обратитесь в поддержку.");
    //         }
    //         return this.openNewRoute('/freelancers/view?id=' + res_response.id);
    //
        }
    }


}