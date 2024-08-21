import {HttpUtils} from "../utils/http-utils.js";
import {IncomeAndExpenses} from "./income-and-expenses.js";
import {IncomeDataUtils} from "../utils/income-data-utils.js";
import {ExpensesDataUtils} from "../utils/expenses-data-utils.js";
import {AuthUtils} from "../utils/auth-utils";

export class CreationIncomeAndExpenses {
    static typeFormLine = {}

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.inputTypeElement = document.getElementById('type')
        this.inputCategoryElement = document.getElementById('сategory')
        this.inputSumElement = document.getElementById('sum')
        this.inputDataElement = document.getElementById('data')
        this.inputCommentElement = document.getElementById('comment')
        this.clickBtnDelete = document.getElementById('delete')

        if (IncomeAndExpenses.wordLink) {
            this.inputTypeElement.value = IncomeAndExpenses.wordLink
            this.inputTypeElement.setAttribute('disabled', true)
        }
        document.getElementById('create').addEventListener('click', this.postForm.bind(this))

    }


    validForm() {

        let hasError = false
        if (!this.inputTypeElement.value || !this.inputTypeElement.value.match(/^[А-Я]+[a-я]+$/) || !['доход', 'расход'].includes(this.inputTypeElement.value.toLowerCase())) {
            this.inputTypeElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.inputTypeElement.classList.remove('is-invalid')
            this.inputTypeElement.classList.add('is-valid')

        }
        if (!this.inputCategoryElement.value || !this.inputCategoryElement.value.match(/^[А-Я]+[a-я]+$/)) {
            this.inputCategoryElement.classList.add('is-invalid')
            hasError = true
        } else if (this.inputCategoryElement.value && (!this.findIncome && !this.findExpense)) {
            this.inputCategoryElement.classList.add('is-invalid')
            document.getElementById('validationServer02Feedback').innerText = 'Такой категории не существует'
            hasError = true
        } else {
            this.inputCategoryElement.classList.remove('is-invalid')
            this.inputCategoryElement.classList.add('is-valid')
        }
        if (!this.inputSumElement.value || !this.inputSumElement.value.match(/^\d+$/)) {
            this.inputSumElement.classList.add('is-invalid')
            hasError = true

        } else {
            this.inputSumElement.classList.remove('is-invalid')
            this.inputSumElement.classList.add('is-valid')

        }
        if (!this.inputDataElement.value || !this.inputDataElement.value.match(/[0-9]{2}\.[0-9]{2}\.[0-9]{4}/)) {
            this.inputDataElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.inputDataElement.classList.remove('is-invalid')
            this.inputDataElement.classList.add('is-valid')

        }
        if (!this.inputCommentElement.value || !this.inputCommentElement.value.match(/^[а-яА-Я ]*$/)) {
            this.inputCommentElement.classList.add('is-invalid')
            hasError = true
        } else {
            this.inputCommentElement.classList.remove('is-invalid')
            this.inputCommentElement.classList.add('is-valid')

        }

        return hasError


    }

    async postForm() {
        this.date = new Date(this.inputDataElement.value).toLocaleString()
        this.getDataIncome = await IncomeDataUtils.getIncome()
        this.getDataExpenses = await ExpensesDataUtils.getExpenses()
        this.findIncome = this.getDataIncome.response.find((item) => {
            if(this.inputTypeElement.value.toLowerCase() === 'доход'){
                return item.title === this.inputCategoryElement.value

            }
        })
        this.findExpense = this.getDataExpenses.response.find((item) => {
            if(this.inputTypeElement.value.toLowerCase() === 'расход') {
                return item.title === this.inputCategoryElement.value
            }
        })
        if (!this.validForm()) {
            let category_id = 1
            if (this.findIncome) {
                category_id = this.findIncome.id
            }
            if (this.findExpense) {
                category_id = this.findExpense.id

            }
            const result = await HttpUtils.request('/operations', 'POST', true, {
                type: this.inputTypeElement.value.toLowerCase(),
                amount: this.inputSumElement.value,
                date: this.date.split(',')[0],
                comment: this.inputCommentElement.value,
                category_id: category_id
            })

            if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
                console.log(result.response.message)
                return alert('Произошла ошибка в просмотре категории доходов и расходов. Если вам необходимо посмотреть данные категории, обратитесь в поддержку!')
            }

            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }


            if(localStorage.getItem('info')){
                this.arr = JSON.parse(localStorage.getItem('info'))
            } else{
                this.arr = []
            }
            const obj = {}
            obj.type = this.inputTypeElement.value.toLowerCase()
            obj.category_id = category_id
            obj.category = this.inputCategoryElement.value.toLowerCase()
            this.arr.push(obj)
            localStorage.setItem('info', JSON.stringify(this.arr))
            //CreationIncomeAndExpenses.typeFormLine['info'] = result.response
            //CreationIncomeAndExpenses.typeFormLine['type'] = this.inputTypeElement.value.toLowerCase()
            this.openNewRoute('/income-and-expenses')

        }
    }

//     nameNewCategory(){
//         return this.inputCategoryElement.value
// }

}
