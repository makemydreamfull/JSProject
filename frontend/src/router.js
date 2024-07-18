import {Layout} from "./components/layout.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";
import {Expenses} from "./components/expenses.js";
import {Income} from "./components/income.js";
import {EditingExpensesIncome} from "./components/editing-expenses-income.js";
import {All} from "./components/all.js";
import {CreationExpensesAndIncome} from "./components/creation-expenses-income.js";
import {Error} from "./components/404.js";
import {CreationEditingAll} from "./components/creation-edit-all.js"
import {Pie} from "./libcomponents/acquisitions.js"

export class Router {
    constructor() {
        this.contentPageElement = document.getElementById('content')
        this.titlePageElement = document.getElementById('title')
        this.categoriesPageElement = document.getElementById('categories')
        this.hiddenPageElement = document.getElementById('item-hidden')
        this.buttonPageElement = document.getElementsByClassName('item-button')
        this.arrowPageElement = document.getElementById('turn')
        this.initEvents();
        this.router = [
            {
                route: '/layout',
                title: 'Главная',
                filePathTemplate: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new Pie();
                },
            },
            {
                route: '/login',
                title: 'Регистрация',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login();
                },
            },
            {
                route: '/sign-up',
                title: 'Авторизация',
                filePathTemplate: '/templates/sign-up.html',
                load: () => {
                    new SignUp();
                },
            },
            {
                route: '/creation-income',
                title: 'Получение дохода',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Создание категории доходов',
                load: () => {
                    new EditingExpensesIncome();
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses.html',
                load: () => {
                    new Expenses();
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                load: () => {
                    new Income();
                },
            },
            {
                route: '/editing-income',
                title: 'Редактирование доходов',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Редактирование категории доходов',
                load: () => {
                    new EditingExpensesIncome();
                },
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование расходов',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Редактирование категории расходов',
                load: () => {
                    new EditingExpensesIncome();
                },
            },
            {
                route: '/editing-all',
                title: 'Редактирование доходов и расходов',
                filePathTemplate: '/templates/editing-all.html',
                filePathTemplateTextTitle: '',
                load: () => {
                    new CreationEditingAll();
                },
            },
            {
                route: '/creation-expenses',
                title: 'Создание расходов',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Создание категории расходов',
                load: () => {
                    new EditingExpensesIncome();
                },
            },
            {
                route: '/creation-all',
                title: 'Создание доходов и расходов',
                filePathTemplate: '/templates/creation-all.html',
                filePathTemplateTextTitle: 'Создание дохода/расхода',
                load: () => {
                    new CreationEditingAll();
                },
            },
            {
                route: '/all',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/all.html',
                load: () => {
                    new All();
                },
            },
            {
                route: '/404',
                title: 'Ошибка',
                filePathTemplate: '/templates/404.html',
                load: () => {
                    new Error();
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        this.categoriesPageElement.addEventListener('click', this.clickButtonCategories.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.pathname
        const newRoute = this.router.find(item => item.route === urlRoute)
        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title
            }
            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
            }
            try {
                if (newRoute.filePathTemplateTextTitle) {
                    document.getElementById('title-container').innerText = newRoute.filePathTemplateTextTitle
                }
            } catch (e) {
                return;
            }

        } else {
            console.log('Error! Not found.')
            window.location = '/404'
        }
    }

    clickButtonCategories() {
        document.querySelectorAll('.link-btn').forEach((el) => {
            el.addEventListener('click', (item) => {
                el.style.backgroundColor = '#0D6EFD'
            })
        })
        this.categoriesPageElement.style.border = '0'
        this.arrowPageElement.style.transform = 'rotate(90deg)'
        this.buttonPageElement[2].style.backgroundColor = '#0D6EFD'
        this.buttonPageElement[2].style.color = '#FFFFFF'
        this.buttonPageElement[2].childNodes[1].style.fill = '#FFFFFF'
        if (this.hiddenPageElement.classList.contains('open')) {
            this.buttonPageElement[2].style.backgroundColor = '#FFFFFF'
            this.buttonPageElement[2].style.color = 'black'
            this.buttonPageElement[2].childNodes[1].style.fill = 'black'
            this.arrowPageElement.style.transform = 'rotate(0deg)'
        } else {
            this.hiddenPageElement.classList.add('open')
        }

    }
}
