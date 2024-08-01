export class Login {
    constructor() {
        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.init();
    }

    init() {
        document.getElementById('button-login').addEventListener('click', () => {

            let hasError = false
            if (!this.emailElement.value || !this.emailElement.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
                this.emailElement.style.borderColor = 'red'
                this.emailElement.classList.add('is-invalid')

                hasError = true
            } else {
                this.emailElement.style.borderColor = 'green'
                this.emailElement.classList.remove('is-invalid')
                this.emailElement.classList.add('is-valid')
            }
            if (!this.passwordElement.value || !this.passwordElement.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}/)) {
                this.passwordElement.style.borderColor = 'red'
                this.passwordElement.classList.add('is-invalid')
                hasError = true
            } else {
                this.passwordElement.style.borderColor = 'green'
                this.passwordElement.classList.remove('is-invalid')
                this.passwordElement.classList.add('is-valid')

            }
            if (!hasError) {

            }
        })
    }

}