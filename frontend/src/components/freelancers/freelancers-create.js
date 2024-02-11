import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";

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
    }


    async saveFreelancer(e) {
        e.preventDefault();
        if (this.validateForm()) {
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
                return alert("Возникла ошибка при запросе фрилансера. Обратитесь в поддержку.");
            }
            return this.openNewRoute('/freelancers/view?id=' + res_response.id);

        }
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement.value &&
            this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        let textInput = [
            this.nameElement, this.nameLastElement, this.educationElement,
            this.locationElement, this.skillElement, this.infoElement
        ];
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
}