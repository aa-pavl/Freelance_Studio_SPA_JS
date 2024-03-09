import {ValidationUtils} from "../../utils/validation-utils";
import {FreelancersService} from "../../service/freelancers-service";
import {OrdersService} from "../../service/orders-service";

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this));

        this.dateScheduled = null;
        this.dateComplete = null;
        this.dateDeadline = null;

        const calendarOptions = {
            inline: true,
                locale: 'ru',
                icons: {
                time: 'far fa-clock',
            },
            useCurrent: false,
        }

        const calendarScheduled = $('#calendar-scheduled');
        calendarScheduled.datetimepicker(calendarOptions);
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.dateScheduled = e.date;
            console.log(this.dateScheduled)
        });

        const calendarDeadline = $('#calendar-deadline');
        calendarDeadline.datetimepicker(calendarOptions);
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.dateDeadline = e.date;
        });

        calendarOptions.buttons = {showClear: true};
        const calendarComplete = $('#calendar-complete');
        calendarComplete.datetimepicker(calendarOptions);
        calendarComplete.on("change.datetimepicker", (e) => {
            this.dateComplete = e.date;
        });


        this.findElements();

        this.validations = [
            {element: this.descriptionInputElement},
            {element: this.amountInputElement},
            {element: this.scheduledCardElement, options: {checkProperty: this.dateScheduled}},
            {element: this.deadlineCardElement, options: {checkProperty: this.dateDeadline}},
        ];

        this.getFreelancers().then();
    }

    findElements() {
        this.freelancerSelectElement = document.getElementById('freelancerSelect');
        this.statusSelectElement = document.getElementById('statusSelect');
        this.descriptionInputElement = document.getElementById('descriptionInput');
        this.amountInputElement = document.getElementById('amountInput');
        this.scheduledCardElement = document.getElementById('scheduled-card');
        this.deadlineCardElement = document.getElementById('deadline-card');
    }

    async getFreelancers() {
        const response = await FreelancersService.getFreelancers();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        for (let i = 0; i < response.freelancers.length; i++) {
            const option = document.createElement('option');
            option.value = response.freelancers[i].id;
            option.innerText = response.freelancers[i].name + " " + response.freelancers[i].lastName;
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

            const response = await OrdersService.createOrders(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/orders/view?id=' + response.id);
        }
    }
}