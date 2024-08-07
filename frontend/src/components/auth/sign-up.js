import config from "../../config/config.js";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.lastNameElement = document.getElementById('last-name')
        this.nameElement = document.getElementById('name')
        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.agreeElement = document.getElementById('agree')
        this.passwordRepeatElement = document.getElementById('password-repeat')

        document.getElementById('button-login').addEventListener('click', this.signUp.bind(this))
    }


    validateForm() {
        let hasError = false
        if (!this.lastNameElement.value || !this.lastNameElement.value.match(/\w\s*/)) {
            this.lastNameElement.style.borderColor = 'red'
            this.lastNameElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.lastNameElement.style.borderColor = 'green'
            this.lastNameElement.classList.remove('is-invalid')
            this.lastNameElement.classList.add('is-valid')
        }
        if (!this.nameElement.value || !this.nameElement.value.match(/\w\s*/)) {
            this.nameElement.style.borderColor = 'red'
            this.nameElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.nameElement.style.borderColor = 'green'
            this.nameElement.classList.remove('is-invalid')
            this.nameElement.classList.add('is-valid')

        }
        if (!this.emailElement.value || !this.emailElement.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}\s*$/)) {
            this.emailElement.style.borderColor = 'red'
            this.emailElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.emailElement.style.borderColor = 'green'
            this.emailElement.classList.remove('is-invalid')
            this.emailElement.classList.add('is-valid')

        }
        if (!this.passwordElement.value || !this.passwordElement.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}\s*/)) {
            this.passwordElement.style.borderColor = 'red'
            this.passwordElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.passwordElement.style.borderColor = 'green'
            this.passwordElement.classList.remove('is-invalid')
            this.passwordElement.classList.add('is-valid')
        }
        if (!this.passwordRepeatElement.value || this.passwordRepeatElement.value !== this.passwordElement.value) {
            this.passwordRepeatElement.style.borderColor = 'red'
            this.passwordRepeatElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.passwordRepeatElement.style.borderColor = 'green'
            this.passwordRepeatElement.classList.remove('is-invalid')
            this.passwordRepeatElement.classList.add('is-valid')
        }
        console.log(this.agreeElement.checked)
        if (!this.agreeElement.checked) {
            this.agreeElement.style.borderColor = 'red'
            this.agreeElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.agreeElement.style.borderColor = 'green'
            this.agreeElement.classList.remove('is-invalid')
            this.agreeElement.classList.add('is-valid')
        }
        return hasError;
    }

    async signUp() {

        if (!this.validateForm()) {
            const result = await fetch(config.api + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: this.nameElement.value,
                    lastName: this.lastNameElement.value,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value,
                })
            })
            const response = await result.json()
            console.log(response)
            if(response.user && (response.user.name && response.user.lastName)){
                sessionStorage.setItem('name', response.user.name)
                sessionStorage.setItem('lastName', response.user.lastName)
                this.openNewRoute('/login')

            }
            else{
                this.openNewRoute('/404')

            }
        }
    }

}