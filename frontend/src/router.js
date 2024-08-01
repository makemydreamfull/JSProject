import {Layout} from "./components/layout.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Expenses} from "./components/type/expenses.js";
import {Income} from "./components/type/income.js";
import {EditingCreationExpensesIncome} from "./components/editing-expenses-income.js";
import {All} from "./components/all.js";
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
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/layout.html',
                load: () => {
                    new Layout();
                    new Pie();
                },
            },
            {
                route: '/creation-income',
                title: 'Получение дохода',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Создание категории доходов',
                load: () => {
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
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
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование расходов',
                filePathTemplate: '/templates/creation-and-editing-input.html',
                filePathTemplateTextTitle: 'Редактирование категории расходов',
                load: () => {
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
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
                    new EditingCreationExpensesIncome(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/creation-all',
                title: 'Создание доходов и расходов',
                filePathTemplate: '/templates/creation-all.html',
                filePathTemplateTextTitle: 'Создание дохода/расхода',
                load: () => {
                    new CreationEditingAll(this.openNewRoute.bind(this));
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
            {
                route: '/login',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/login.html',
                load: () => {
                    new Login();
                },
            },
            {
                route: '/sign-up',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/sign-up.html',
                load: () => {
                    new SignUp();
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this))
        this.categoriesPageElement.addEventListener('click', this.clickButtonCategories.bind(this));
    }

    async openNewRoute(url){
        const currentRoute = window.location.pathname
        history.pushState({},'',url)
        await this.activateRoute(null, currentRoute)
    }
    async clickHandler(e){
        let element = null;
        if(e.target.parentElement.nodeName === 'A'){
            element = e.target.parentElement
        }
        console.log(e.target.parentElement)
        if(element){
            e.preventDefault();
            const currentRoute = window.location.pathname
            const url = element.href.replace(window.location.origin, '')
            if(!url || url === '/#' || url.startsWith('javascript:void(0)')){
                return
            }
            await this.openNewRoute(url)
        }
    }
    async activateRoute(e,oldRoute = null) {
        const urlRoute = window.location.pathname
        console.log(urlRoute)
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
            history.pushState({},'', '/404')
            await this.activateRoute()
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
        document.getElementsByClassName('down')[0].style.marginTop = '451px'
        if (this.hiddenPageElement.classList.contains('open')) {
            this.buttonPageElement[2].style.backgroundColor = '#0D6EFD'
            this.buttonPageElement[2].style.color = '#FFFFFFFF'
            this.buttonPageElement[2].childNodes[1].style.fill = '#FFFFFFFF'
            this.arrowPageElement.style.transform = 'rotate(0deg)'
            this.hiddenPageElement.classList.remove('open')
        } else {
            this.hiddenPageElement.classList.add('open')
        }

    }
}
