import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";

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
        calendarScheduled.on("change.datetimepicker", (e) => {
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
        calendarComplete.on("change.datetimepicker", (e) => {
            this.dateComplete = e.date;
        });
        calendarDeadline.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.dateDeadline = e.date;
        });

        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.completeCardElement = document.getElementById('complete-card');
        this.deadlineCardElement = document.getElementById('deadline-card');

        this.validations = [
            {element: this.descriptionInputElement},
            {element: this.amountInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.dateScheduled}},
            {element: this.deadlineCardElement, options: {checkProperty: this.dateDeadline}},
        ];

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

    // validateForm() {
    //     if (this.dateScheduled) {
    //         this.scheduledCardElement.classList.remove('is-invalid');
    //     } else {
    //         this.scheduledCardElement.classList.add('is-invalid');
    //         isValid = false;
    //     }
    //
    //     if (this.dateDeadline) {
    //         this.deadlineCardElement.classList.remove('is-invalid');
    //     } else {
    //         this.deadlineCardElement.classList.add('is-invalid');
    //         isValid = false;
    //     }
    //
    //     return isValid;
    // }

    async saveOrder(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.dateDeadline.toISOString(),
                scheduledDate: this.dateScheduled.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value),
            }
            if (this.dateComplete) {
                createData.completeDate = this.dateComplete.toISOString();
            }

            const result = await HttpUtils.request('/orders', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            const res_response = result.response;
            if (res_response.error || !res_response || (res_response && res_response.error)) {
                console.log(res_response.message);
                return alert("Возникла ошибка при добавление заказа. Обратитесь в поддержку.");
            }
            return this.openNewRoute('/orders/view?id=' + res_response.id);

        }
    }
}