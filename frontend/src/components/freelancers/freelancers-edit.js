import {FileUtils} from "../../utils/file-utils";
import config from "../../config/config";
import {CommonUtils} from "../../utils/common-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FreelancersService} from "../../service/freelancers-service";

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.freelancerOriginalData = null;

        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/');
        }
        this.getFreelancer(id).then();


        document.getElementById('updateButton').addEventListener('click', this.updateFreelancer.bind(this));
        bsCustomFileInput.init();

        this.findElements();

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

    findElements() {
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
        const response = await FreelancersService.getFreelancers(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.freelancerOriginalData = response.freelancer;
        this.showFreelancer(response.freelancer)
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
        if (ValidationUtils.validateForm(this.validations)) {
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
                const response = await FreelancersService.updateFreelancer(this.freelancerOriginalData.id, changedData);
                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }
                return this.openNewRoute('/freelancers/view?id=' + this.freelancerOriginalData.id);
            }
        }
    }
}