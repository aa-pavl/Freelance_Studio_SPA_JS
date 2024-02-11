import {HttpUtils} from "../../utils/http-utils";
import {FileUtils} from "../../utils/file-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.freelancerOriginalData = null;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        this.getFreelancer(id).then();


        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));
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


    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        const res_response = result.response;
        if (res_response.error || !res_response || (res_response && res_response.error)) {
            console.log(res_response.message);
            return alert("Возникла ошибка при запросе фрилансера. Обратитесь в поддержку.");
        }

        this.freelancerOriginalData = res_response;
        this.showFreelancer(res_response)
    }

    showFreelancer(freelancer) {
        const breadcrumbsElement = document.getElementById('breadcrumbs-freelancer');
        breadcrumbsElement.href = '/freelancers/view?id=' + freelancer.id;
        breadcrumbsElement.innerText = freelancer.name + " " + freelancer.lastName;

        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar;
        }
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level);

        this.nameElement.value = freelancer.name;
        this.nameLastElement.value = freelancer.lastName;
        this.emailElement.value = freelancer.email;
        this.educationElement.value = freelancer.education;
        this.locationElement.value = freelancer.location;
        this.skillElement.value = freelancer.skills;
        this.infoElement.value = freelancer.info;

        for (let i = 0; i < this.levelElement.options.length; i++) {
            if (this.levelElement.options[i].value == freelancer.level) {
                this.levelElement.selectedIndex = i;
            }
        }
    }


    async updateFreelancer(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const changedData = {};
            if (this.nameElement.value !== this.freelancerOriginalData.name) {
                changedData.name = this.nameElement.value;
            }
            if (this.nameLastElement.value !== this.freelancerOriginalData.lastName) {
                changedData.lastName = this.nameLastElement.value;
            }
            if (this.emailElement.value !== this.freelancerOriginalData.email) {
                changedData.email = this.emailElement.value;
            }
            if (this.educationElement.value !== this.freelancerOriginalData.education) {
                changedData.education = this.educationElement.value;
            }
            if (this.locationElement.value !== this.freelancerOriginalData.location) {
                changedData.location = this.locationElement.value;
            }
            if (this.skillElement.value !== this.freelancerOriginalData.skills) {
                changedData.skills = this.skillElement.value;
            }
            if (this.infoElement.value !== this.freelancerOriginalData.info) {
                changedData.info = this.infoElement.value;
            }
            if (this.levelElement.value !== this.freelancerOriginalData.level) {
                changedData.level = this.levelElement.value;
            }
            if (this.avatarElement.files && this.avatarElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarElement.files[0]);
            }

            console.log(changedData)

            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/freelancers/' + this.freelancerOriginalData.id, 'PUT', true, changedData);
                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                const res_response = result.response;
                if (res_response.error || !res_response || (res_response && res_response.error)) {
                    console.log(res_response.message);
                    return alert("Возникла ошибка при редактирование фрилансера. Обратитесь в поддержку.");
                }
                return this.openNewRoute('/freelancers/view?id=' + this.freelancerOriginalData.id);
            }


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