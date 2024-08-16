import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils";

export class CreationCategoriesIncomeAndExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.valueTypeElement = document.getElementById('type')
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login')
        }
        if (localStorage.getItem('categories')) {
            this.valueTypeElement.value = JSON.parse(localStorage.getItem('categories')).title
        }
        this.clickBtnDelete = document.getElementById('remove')
        this.clickBtnCreate = document.getElementById('create')
        this.clickBtnCreate.addEventListener('click', this.clickBtn.bind(this))

    }


    async clickBtn(e) {
        e.preventDefault()
        if (this.valueTypeElement && this.valueTypeElement.value.match(/[А-Я][а-я]*/)) {
            const result = await HttpUtils.request('/categories/expense/' + JSON.parse(localStorage.getItem('categories')).number, 'PUT', true, {
                title: this.valueTypeElement.value
            })
            console.log(result)
            if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
                console.log(result.response.message)
                return alert('Произошла ошибка в просмотре категории расходов. Если вам необходимо посмотреть данную категорию, обратитесь в поддержку!')
            }
            return this.openNewRoute('/expenses')
        } else {
            document.querySelectorAll('.form-control')[0].classList.add('is-invalid')
            return
        }

    }


}