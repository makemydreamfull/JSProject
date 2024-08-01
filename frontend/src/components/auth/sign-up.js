export class SignUp {
    constructor() {
        this.lastNameElement = document.getElementById('last-name')
        this.nameElement = document.getElementById('name')
        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.init();
    }

    init() {
        let hasError = false
        document.getElementById('button-login').addEventListener('click', () => {

            if (!this.lastNameElement.value || !this.lastNameElement.value.match(/\w/)) {
                this.lastNameElement.style.borderColor = 'red'
                this.lastNameElement.classList.add('is-invalid')
                hasError = true
            } else {
                this.lastNameElement.style.borderColor = 'green'
                this.lastNameElement.classList.remove('is-invalid')
                this.lastNameElement.classList.add('is-valid')

            }
            if (!this.nameElement.value || !this.nameElement.value.match(/\w/)) {
                this.nameElement.style.borderColor = 'red'
                this.nameElement.classList.add('is-invalid')
                hasError = true
            } else {
                this.nameElement.style.borderColor = 'green'
                this.nameElement.classList.remove('is-invalid')
                this.nameElement.classList.add('is-valid')

            }
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
        })
    if(!hasError){
        this.work()
    }
    }
    async work(){
        // const response = await fetch()
    }

}