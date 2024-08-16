import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";

export class CreationCategoriesExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.clickBtnDelete = document.getElementById('delete')
        this.clickBtnCreate = document.getElementById('create')
        this.valueTypeElement = document.getElementById('type')

        this.clickBtnCreate.addEventListener('click', this.validForm.bind(this))

    }

    validForm() {

        if (this.valueTypeElement && this.valueTypeElement.value.match(/[А-Я][а-я]*/)) {
            document.querySelectorAll('.form-control')[0].classList.add('is-valid')
            this.clickBtn()
        } else {
            document.querySelectorAll('.form-control')[0].classList.add('is-invalid')
            return
        }
    }

    async clickBtn() {
        const result = await HttpUtils.request('/categories/expense', 'POST', true, {
            title: this.valueTypeElement.value
        })
        console.log(result)
        if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
            console.log(result.response.message)
            return alert('Произошла ошибка в создании категории расходов. Если вам необходимо создать данную категорию, обратитесь в поддержку!')
        }
        if (result.response.id && result.response.title) {
            return this.openNewRoute('/expenses')
        }


    }


}