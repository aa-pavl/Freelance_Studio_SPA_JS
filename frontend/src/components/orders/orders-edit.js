import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this));
        this.orderOriginalData = null;

        this.dateScheduled = null;
        this.dateComplete = null;
        this.dateDeadline = null;

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
        ];

        this.init(id).then();
    }

    async init(id) {
        const orderData = await this.getOrder(id);

        if (orderData) {
            this.showOrder(orderData);
            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id);
            }
        }
    }

    async getOrder(id) {
        const result = await HttpUtils.request('/orders/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        const res_response = result.response;
        if (res_response.error || !res_response || (res_response && res_response.error)) {
            console.log(res_response.message);
            return alert("Возникла ошибка при запросе заказа. Обратитесь в поддержку.");
        }

        this.orderOriginalData = res_response;
        return res_response;
    }

    showOrder(order) {
        const breadcrumbsElement = document.getElementById('breadcrumbs-order');
        breadcrumbsElement.href = '/orders/view?id=' + order.id;
        breadcrumbsElement.innerText = order.number;

        this.amountInputElement.value = order.amount;
        this.descriptionInputElement.value = order.description;
        for (let i = 0; i < this.statusSelectElement.options.length; i++) {
            if (this.statusSelectElement.options[i].value == order.status) {
                this.statusSelectElement.selectedIndex = i;
            }
        }


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
            date: order.scheduledDate,
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
            date: order.completeDate,
        });
        calendarComplete.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.dateComplete = e.date;
            } else if (this.orderOriginalData.completeDate) {
                this.dateComplete = false;
            } else {
                this.dateComplete = null;
            }
        });
        calendarDeadline.datetimepicker({
            inline: true,
            locale: 'ru',
            icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
            date: order.deadlineDate,
        });
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.dateDeadline = e.date;
        });

    }

    async getFreelancers(curFreelancerId) {
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
            if (curFreelancerId === freelancers[i].id) {
                option.selected = true;
            }
            this.freelancerSelectElement.appendChild(option);
        }
        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        });
    }


    async updateOrder(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {};
            if (parseInt(this.amountInputElement.value) !== parseInt(this.orderOriginalData.amount)) {
                changedData.amount = this.amountInputElement.value;
            }
            if (this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionInputElement.value;
            }
            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value;
            }
            if (this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changedData.freelancer = this.freelancerSelectElement.value;
            }
            if (this.dateScheduled) {
                changedData.scheduledDate = this.dateScheduled.toISOString();
            }
            if (this.dateComplete || this.dateComplete === false) {
                changedData.completeDate = this.dateComplete ? this.dateComplete.toISOString() : null;
            }
            if (this.dateDeadline) {
                changedData.deadlineDate = this.dateDeadline.toISOString();
            }

            console.log(changedData)
            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/orders/' + this.orderOriginalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                const res_response = result.response;
                if (res_response.error || !res_response || (res_response && res_response.error)) {
                    console.log(res_response.message);
                    return alert("Возникла ошибка при редактирование заказа. Обратитесь в поддержку.");
                }
                return this.openNewRoute('/orders/view?id=' + this.orderOriginalData.id);
            }
        }
    }
}