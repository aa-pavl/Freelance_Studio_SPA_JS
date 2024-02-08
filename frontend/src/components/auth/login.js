import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
        this.commonErrorElement.style.display = 'none';
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const result = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            })

            const res_response = result.response;
            if (result.error || !res_response ||
                (res_response && (!res_response.accessToken|| !res_response.refreshToken|| !res_response.id|| !res_response.name))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }
            AuthUtils.setAuthInfo(res_response.accessToken, res_response.refreshToken, {id: res_response.id, name: res_response.name})
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