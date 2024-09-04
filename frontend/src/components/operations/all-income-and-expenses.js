import {HttpUtils} from "../../utils/http-utils.js";
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
        this.inputCategoryElement = document.getElementById('category')
        this.inputSumElement = document.getElementById('sum')
        this.inputDataElement = document.getElementById('data')
        this.inputCommentElement = document.getElementById('comment')
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
            } else if (this.type === 'expense') {
                this.inputTypeElement.value = 'Расход'
            } else {
                return this.openNewRoute('/')
            }
        } else {
            return this.openNewRoute('/')

        }

        datepicker('.data', {
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
        this.operationCategoriesType()
        this.types = document.getElementById('types')
        document.getElementById('create').addEventListener('click', this.postForm.bind(this))
        // document.getElementById('type').addEventListener('click', this.clickTypeElements.bind(this))
    }

    // clickTypeElements() {
    //     if (this.inputTypeElement.value === 'Расход') {
    //         this.types.innerText = 'Доход'
    //         this.types.onclick =  () => {
    //             document.getElementById('type').innerText = 'Доход';
    //             document.getElementById('types').innerText = 'Расход';
    //             this.showTypeElements()
    //         }
    //     } else if (this.inputTypeElement.value === 'Доход') {
    //         this.types.innerText = 'Расход'
    //         this.types.onclick =  () => {
    //             document.getElementById('type').innerText = 'Расход';
    //             document.getElementById('types').innerText = 'Доход';
    //             this.showTypeElements()
    //         }
    //     }
    //
    // }

    showTypeElements() {
        const arrItemsDropdown = document.querySelectorAll('.dropdown-item')
        if (arrItemsDropdown.length > 0) {
            this.inputCategoryElement.innerText = arrItemsDropdown[0].innerText
            arrItemsDropdown.forEach((item) => {
                item.addEventListener('click', function () {
                    document.getElementById('category').innerText = item.innerText
                })
            })
        } else {
            alert('Ошибка! Добавьте категории в выбранном вами разделе.')
            return this.openNewRoute('/' + window.location.search.replace('?type=', ''))
        }
    }


    checkTypeElements() {
        if (this.inputTypeElement.value === 'Доход' || this.inputTypeElement.value === 'income') {
            this.data = this.getDataIncome.response
        } else if (this.inputTypeElement.value === 'Расход' || this.inputTypeElement.value === 'expense') {
            this.data = this.getDataExpenses.response
        } else {
            alert('Ошибка! Даного типа не существует')
            this.inputTypeElement.classList.add('is-invalid')
        }
    }

    async operationCategoriesType() {
        this.getDataIncome = await IncomeDataUtils.getIncome()
        this.getDataExpenses = await ExpensesDataUtils.getExpenses()
        // Блюр элемента и изменение категории в зависимости от типа
        this.inputTypeElement.onblur = () => {
            this.checkTypeElements()
            document.querySelectorAll('.dropdown-item').forEach(item => item.remove())
            this.data.forEach((item) => {
                const buttonElement = document.createElement('button')
                const liElement = document.createElement('li')
                buttonElement.classList.add('dropdown-item')
                buttonElement.innerText = item.title
                liElement.appendChild(buttonElement)
                document.getElementById('category-link').appendChild(liElement);
                this.inputCategoryElement.innerText = document.querySelector('.dropdown-item').innerText
                this.inputTypeElement.classList.add('is-valid')
            })
            this.showTypeElements()
        }
        //Появление элементов указанного типа из бэкенда
        this.checkTypeElements()
        this.data.forEach((item) => {
            const buttonElement = document.createElement('button')
            const liElement = document.createElement('li')
            buttonElement.classList.add('dropdown-item')
            buttonElement.innerText = item.title
            liElement.appendChild(buttonElement)
            document.getElementById('category-link').appendChild(liElement)
        })

        this.showTypeElements()


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
        if (!this.inputCategoryElement.innerText || !this.inputCategoryElement.innerText.match(/[А-Я][а-я]*/)) {
            this.inputCategoryElement.classList.add('is-invalid')
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
            const result = await HttpUtils.request('/operations/' + this.id)
            if (result.response.type === 'income') {
                this.inputTypeElement.value = 'Доход'
            } else if (result.response.type === 'expense') {
                this.inputTypeElement.value = 'Расход'
            }
            this.inputCategoryElement.innerText = result.response.category
            this.inputSumElement.value = result.response.amount;
            this.inputDataElement.value = result.response.date;
            this.inputCommentElement.value = result.response.comment;
            [this.url, this.method] = ['/operations/' + this.id, 'PUT'];

        } else {
            throw new Error('Ошибка!')
        }
    }

    async postForm() {
        if (!this.validForm()) {
            this.date = new Date(this.currencyDate).toISOString().split('T')[0]
            console.log(this.date)
            this.getDataIncome = await IncomeDataUtils.getIncome()
            this.getDataExpenses = await ExpensesDataUtils.getExpenses()
            this.categoryId = null
            this.type = null
            if (this.getDataIncome) {

                this.findIncome = this.getDataIncome.response.find((item) => {
                    return item.title === this.inputCategoryElement.innerText
                })
                if (this.findIncome) {
                    [this.categoryId, this.type] = [this.findIncome.id, 'income']
                }
            }
            if (this.getDataExpenses) {
                this.findExpense = this.getDataExpenses.response.find((item) => {
                    return item.title === this.inputCategoryElement.innerText
                })
                if (this.findExpense) {
                    [this.categoryId, this.type] = [this.findExpense.id, 'expense']
                }
            }


            const result = await HttpUtils.request(this.url, this.method, true, {
                type: this.type,
                amount: this.inputSumElement.value,
                date: this.date,
                comment: this.inputCommentElement.value,
                category_id: this.categoryId
            })
            console.log(result.response)
            if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
                console.log(result.response.message)
                return alert('Произошла ошибка в просмотре категории доходов и расходов. Если вам необходимо посмотреть данные категории, обратитесь в поддержку!')
            }
            this.openNewRoute('/income-and-expenses')
        }


    }

}
