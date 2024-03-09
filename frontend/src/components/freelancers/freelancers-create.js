import {FileUtils} from "../../utils/file-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {FreelancersService} from "../../service/freelancers-service";

export class FreelancersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        document.getElementById('saveButton').addEventListener('click', this.saveFreelancer.bind(this));
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

            const response = await FreelancersService.createFreelancers(createData);
            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }
            return this.openNewRoute('/freelancers/view?id=' + response.id);
        }
    }
}