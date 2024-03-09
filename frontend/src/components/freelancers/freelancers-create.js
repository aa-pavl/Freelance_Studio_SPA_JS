import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class FreelancersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveFreelancer.bind(this));
        bsCustomFileInput.init();

        this.nameElement = document.getElementById('nameInput');
        this.nameLastElement = document.getElementById('nameLastInput');
        this.emailElement = document.getElementById('emailInput');
        this.educationElement = document.getElementById('educationInput');
        this.locationElement = document.getElementById('locationInput');
        this.skillElement = document.getElementById('skillsInput');
        this.infoElement = document.getElementById('infoInput');
        this.levelElement = document.getElementById('levelSelect');
        this.avatarElement = document.getElementById('avatarInput');

        this.validations = [
            {element: this.nameElement},
            {element: this.nameLastElement},
            {element: this.educationElement},
            {element: this.locationElement},
            {element: this.skillElement},
            {element: this.infoElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ];
    }


    async saveFreelancer(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const createData = {
                name: this.nameElement.value,
                lastName: this.nameLastElement.value,
                email: this.emailElement.value,
                level: this.levelElement.value,
                education: this.educationElement.value,
                location: this.locationElement.value,
                skills: this.skillElement.value,
                info: this.infoElement.value,
            }
            if (this.avatarElement.files && this.avatarElement.files.length > 0) {
                createData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarElement.files[0]);
            }

            const result = await HttpUtils.request('/freelancers', 'POST', true, createData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            const res_response = result.response;
            if (res_response.error || !res_response || (res_response && res_response.error)) {
                console.log(res_response.message);
                return alert("Возникла ошибка при создание фрилансера. Обратитесь в поддержку.");
            }
            return this.openNewRoute('/freelancers/view?id=' + res_response.id);

        }
    }
}