import {HttpUtils} from "../../utils/http-utils.js";
import {IncomeAndExpenses} from "../income-and-expenses.js";
import {IncomeDataUtils} from "../../utils/income-data-utils.js";
import {ExpensesDataUtils} from "../../utils/expenses-data-utils.js";
import {AuthUtils} from "../../utils/auth-utils.js";
import datepicker from 'js-datepicker'

export class AllIncomeAndExpenses {

    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute
        this.typeCategories = type
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.inputTypeElement = document.getElementById('type')
        this.inputCategoryElement = document.getElementById('сategory')
        this.inputSumElement = document.getElementById('sum')
        this.inputDataElement = document.getElementById('data')
        this.inputCommentElement = document.getElementById('comment')
        this.clickBtnDelete = document.getElementById('delete')

        const urlParams = new URLSearchParams(window.location.search);
        this.id = urlParams.get('id')
        this.type = urlParams.get('type')
        this.categories = urlParams.get('categories')
        if (this.typeCategories === 'edit') {
            if (!this.id || !this.type || !this.categories) {
                return this.openNewRoute('/')
            }
        }
        if (this.type) {
            if (this.type === 'income') {
                this.inputTypeElement.value = 'Доход'
            } else if (this.type === 'expenses') {
                this.inputTypeElement.value = 'Расход'
            } else {
                return this.openNewRoute('/')
            }
        } else {
            return this.openNewRoute('/')

        }
        datepicker(document.querySelector('.data'),
            {
                formatter: (input, date, instance) => {
                    this.currencyDate = date
                    const value = date.toLocaleDateString()
                    input.value = value // => '1/1/2099'
                },
                showAllDates: true,
                customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                customDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            })

        document.getElementById('main-title').innerText = (this.typeCategories === 'edit' ? 'Редактирование ' : 'Создание ') + 'дохода/расхода'
        document.getElementById('create').innerText = (this.typeCategories === 'edit') ? 'Сохранить' : 'Создать'
        this.init()
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

    async init() {

        this.url = null
        this.method = null
        if (this.typeCategories === 'add') {

            [this.url, this.method] = ['/operations', 'POST']
        } else if (this.typeCategories === 'edit') {
            if (this.typeCategories === 'edit') {
                const result = await HttpUtils.request('/operations/' + this.id)
                console.log(result)
                this.inputSumElement.value = result.response.amount;
                this.inputDataElement.value = result.response.date;
                this.inputCommentElement.value = result.response.comment[0].toUpperCase() + result.response.comment.slice(1);
                this.inputCategoryElement.value = this.categories[0].toUpperCase() + this.categories.slice(1);
            }
            [this.url, this.method] = ['/operations/' + this.id, 'PUT'];

        } else {
            throw new Error('Ошибка!')
        }
    }

    async postForm() {
        this.date = new Date(this.currencyDate).toLocaleString()
        this.getDataIncome = await IncomeDataUtils.getIncome()
        this.getDataExpenses = await ExpensesDataUtils.getExpenses()
        if (this.getDataIncome) {
            this.findIncome = this.getDataIncome.response.find((item) => {
                if (this.inputTypeElement.value.toLowerCase() === 'доход') {
                    return item.title === this.inputCategoryElement.value

                }
            });
        } else {
            throw new Error('Ошибка! Нет категорий в разделе Доходы')
        }
        if (this.getDataIncome) {
            this.findExpense = this.getDataExpenses.response.find((item) => {
                if (this.inputTypeElement.value.toLowerCase() === 'расход') {
                    return item.title === this.inputCategoryElement.value
                }
            })
        } else {
            throw new Error('Ошибка! Нет категорий в разделе Расходы')
        }
        if (!this.validForm()) {
            let category_id = 1
            if (this.findIncome) {
                category_id = this.findIncome.id
            }
            if (this.findExpense) {
                category_id = this.findExpense.id

            }
            const result = await HttpUtils.request(this.url, this.method, true, {
                type: this.inputTypeElement.value.toLowerCase(),
                amount: this.inputSumElement.value,
                date: this.date.split(',')[0],
                comment: this.inputCommentElement.value,
                category_id: category_id
            })
            console.log(result)
            if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
                console.log(result.response.message)
                return alert('Произошла ошибка в просмотре категории доходов и расходов. Если вам необходимо посмотреть данные категории, обратитесь в поддержку!')
            }
            if (localStorage.getItem('info')) {
                this.arr = JSON.parse(localStorage.getItem('info'))
            } else {
                this.arr = []
            }
            const obj = {}
            obj.type = this.inputTypeElement.value.toLowerCase()
            obj.category_id = result.response.id
            obj.category = this.inputCategoryElement.value.toLowerCase()
            this.arr.push(obj)
            localStorage.setItem('info', JSON.stringify(this.arr))
            //CreationIncomeAndExpenses.typeFormLine['info'] = result.response
            //CreationIncomeAndExpenses.typeFormLine['type'] = this.inputTypeElement.value.toLowerCase()
            this.openNewRoute('/income-and-expenses?type=' + this.type + '&categories=' + this.categories)
        }


    }

}
