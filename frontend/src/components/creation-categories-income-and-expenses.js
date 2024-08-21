import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";
import {Expenses} from "./type/expenses.js";
import {Income} from "./type/income.js";
export class CreationCategoriesIncomeAndExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        this.valueTypeElement = document.getElementById('type')
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login')
        }
        if(Object.keys(Expenses.objEditExpenses).length > 0 && window.location.pathname.replace('/editing-', '') === 'expenses'){
            this.valueTypeElement.value = Expenses.objEditExpenses.title
        }
        if(Object.keys(Income.objEditIncome).length > 0  && window.location.pathname.replace('/editing-', '') === 'income'){
            this.valueTypeElement.value = Income.objEditIncome.title
        }
        this.clickBtnCreate = document.getElementById('create')
        this.clickBtnCreate.addEventListener('click', this.clickBtnUpdate.bind(this))

    }


    async clickBtnUpdate(e) {
        e.preventDefault()
        if (window.location.pathname.replace('/editing-', '') === 'expenses' && (this.valueTypeElement && this.valueTypeElement.value.match(/[А-Я][а-я]*/))) {
            const result = await HttpUtils.request('/categories/expense/' + Expenses.objEditExpenses.id, 'PUT', true, {
                title: this.valueTypeElement.value
            })
            if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
                console.log(result.response.message)
                return alert('Произошла ошибка в просмотре категории расходов. Если вам необходимо посмотреть данную категорию, обратитесь в поддержку!')
            }
            return this.openNewRoute('/expenses')
        } else {
            document.querySelectorAll('.form-control')[0].classList.add('is-invalid')
        }
        if (window.location.pathname.replace('/editing-', '') === 'income' && (this.valueTypeElement && this.valueTypeElement.value.match(/[А-Я][а-я]*/))) {
            const result = await HttpUtils.request('/categories/income/' + Income.objEditIncome.id, 'PUT', true, {
                title: this.valueTypeElement.value
            })
            if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
                console.log(result.response.message)
                return alert('Произошла ошибка в просмотре категории расходов. Если вам необходимо посмотреть данную категорию, обратитесь в поддержку!')
            }
            return this.openNewRoute('/income')
        } else {
            document.querySelectorAll('.form-control')[0].classList.add('is-invalid')
            return
        }


    }



}