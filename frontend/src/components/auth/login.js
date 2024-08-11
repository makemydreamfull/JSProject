import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.rememberElement = document.getElementById('remember')
        document.getElementById('button-login').addEventListener('click', this.checkInput.bind(this))
    }


    async checkInput() {
        const result = await HttpUtils.request('/login', 'POST', true, {
            email: this.emailElement.value,
            password: this.passwordElement.value,
            rememberMe: this.rememberElement.checked
        })
        console.log(result)
        if (result.error || result.response.error && result.response.message) {
            document.getElementById('all-error').style.display = 'block'
            return;
        }
        if (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user) {
            this.openNewRoute('/404')
            return
        }
        AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
            name: result.response.user.name,
            lastName: result.response.user.lastName
        })
        this.openNewRoute('/')


    }
}