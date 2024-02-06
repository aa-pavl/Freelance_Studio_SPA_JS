import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('lastname');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        // this.rememberMeElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');
        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    async signup() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const result = await HttpUtils.request('/signup', 'POST', {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
            })

            const res_responce = result.responce;
            if (result.error || !res_responce ||
                (res_responce && (!res_responce.accessToken|| !res_responce.refreshToken|| !res_responce.id|| !res_responce.name))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            AuthUtils.setAuthInfo(res_responce.accessToken, res_responce.refreshToken, {id: res_responce.id, name: res_responce.name})
            this.openNewRoute('/')
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

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }
}