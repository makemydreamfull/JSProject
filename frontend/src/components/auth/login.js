import config from "../../config/config.js";
export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.rememberElement = document.getElementById('remember')
        document.getElementById('button-login').addEventListener('click', this.checkInput.bind(this))
    }


    async checkInput() {

        let hasError = false
        // if (!this.emailElement.value || !this.emailElement.value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
        //     this.emailElement.style.borderColor = 'red'
        //     this.emailElement.classList.add('is-invalid')
        //
        //     hasError = true
        // } else {
        //     this.emailElement.style.borderColor = 'green'
        //     this.emailElement.classList.remove('is-invalid')
        //     this.emailElement.classList.add('is-valid')
        // }
        // if (!this.passwordElement.value || !this.passwordElement.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}/)) {
        //     this.passwordElement.style.borderColor = 'red'
        //     this.passwordElement.classList.add('is-invalid')
        //     hasError = true
        // } else {
        //     this.passwordElement.style.borderColor = 'green'
        //     this.passwordElement.classList.remove('is-invalid')
        //     this.passwordElement.classList.add('is-valid')
        //
        // }
        // if (!hasError) {
        //
        // }

        const result = await fetch(config.api + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberElement.checked
            })
        })
        const response = await result.json()
        console.log(response)
        if(response.error && response.message){
            document.getElementById('all-error').style.display = 'block'
            return
        }
        if(!response.tokens.accessToken || !response.tokens.refreshToken || !response.user){
            this.openNewRoute('/404')
        }
        else{
            sessionStorage.setItem('accessToken', response.tokens.accessToken)
            sessionStorage.setItem('refreshToken', response.tokens.refreshToken)
            sessionStorage.setItem('name', response.user.name)
            sessionStorage.setItem('lastName', response.user.lastName)
            this.openNewRoute('/')
        }




    }
}