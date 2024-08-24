import {Layout} from "./components/layout.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Expenses} from "./components/type/expenses.js";
import {Income} from "./components/type/income.js";
import {Pie} from "./libcomponents/acquisitions.js"
import {Logout} from "./components/auth/logout.js";
import {AuthUtils} from "./utils/auth-utils.js";
import {IncomeAndExpenses} from "./components/income-and-expenses.js";
import {HttpUtils} from "./utils/http-utils.js";
import {Category} from "./components/create-edit-category.js";
import {AllIncomeAndExpenses} from "./components/operations/all-income-and-expenses";

export class Router {
    constructor() {

        this.contentPageElement = document.getElementById('content')
        this.titlePageElement = document.getElementById('title')

        this.router = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/layout.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new Layout();
                    new Pie();
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/creation-income',
                title: 'Создание категории дохода',
                filePathTemplate: '/templates/operations/income/creation-income.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new Category(this.openNewRoute.bind(this), 'income', 'add');
                },
            },

            {
                route: '/creation-expenses',
                title: 'Создание категории расхода',
                filePathTemplate: '/templates/operations/expenses/creation-expenses.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new Category(this.openNewRoute.bind(this), 'expense', 'add');
                },
            },
            {
                route: '/editing-income',
                title: 'Редактирование доходов',
                filePathTemplate: '/templates/operations/income/editing-income.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new Category(this.openNewRoute.bind(this), 'income', 'edit');
                },
            },
            {
                route: '/editing-expenses',
                title: 'Редактирование расходов',
                filePathTemplate: '/templates/operations/expenses/editing-expenses.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new Category(this.openNewRoute.bind(this), 'expense', 'edit');
                },
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/type/expenses.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/type/income.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                },

            },
            {
                route: '/editing-income-and-expenses',
                title: 'Редактирование доходов и расходов',
                filePathTemplate: '/templates/operations/editing-income-and-expenses.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new AllIncomeAndExpenses(this.openNewRoute.bind(this), 'edit');
                },
            },
            {
                route: '/creation-income-and-expenses',
                title: 'Создание доходов и расходов',
                filePathTemplate: '/templates/operations/creation-income-and-expenses.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new AllIncomeAndExpenses(this.openNewRoute.bind(this),'add');
                },
            },
            {
                route: '/income-and-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income-and-expenses.html',
                useSidebar: '/templates/main.html',
                load: () => {
                    new IncomeAndExpenses(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/404',
                title: 'Ошибка',
                filePathTemplate: '/templates/404.html',
                useSidebar: false,
                load: () => {
                },
            },
            {
                route: '/login',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/login.html',
                useSidebar: false,
                load: () => {
                    document.body.style.display = 'flex'
                    document.body.style.justifyContent = 'center'
                    new Login(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/sign-up',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/sign-up.html',
                useSidebar: false,
                load: () => {
                    document.body.style.display = 'flex'
                    document.body.style.justifyContent = 'center'
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
        ]
        this.initEvents();

    }

    initEvents() {
        if ((!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) || !AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey)) {
            // document.getElementById('sidebar').style.display = 'none'
            this.openNewRoute('/login')
        } else if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute(window.location.pathname)
        }
        document.addEventListener('click', this.clickHandler.bind(this))
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname
        history.pushState({}, '', url)
        await this.activateRoute(null, currentRoute)
    }

    async clickHandler(e) {
        let element = null;
        console.log(e.target)
        try{
            if (e.target.parentElement.nodeName === 'A') {
                element = e.target.parentElement
            } else if (e.target.nodeName === 'A') {
                element = e.target
            } else if (e.target.parentElement.parentElement.nodeName === 'A') {
                element = e.target.parentElement.parentElement
            } else{
                return;
            }
        } catch (e) {
            element = null
        }

        if (element) {
            e.preventDefault()
            const currentRoute = window.location.pathname
            const url = element.href.replace(window.location.origin, '')
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return
            }
            if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && url !== '/sign-up') {
                return this.openNewRoute('/login')
            }
            await this.openNewRoute(url)
        }
    }

    async activateRoute(e, oldRoute = null) {
        const urlRoute = window.location.pathname
        let newRoute = this.router.find(item => item.route === urlRoute)
        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement
                if (newRoute.useSidebar) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useSidebar).then(response => response.text())
                    contentBlock = document.getElementById('content-layout')
                    document.body.style.display = 'block'
                    document.body.style.justifyContent = 'none'
                    this.categoriesPageElement = document.getElementById('categories')
                    this.categoriesPageElement.addEventListener('click', this.clickButtonCategoriesAndExit.bind(this));
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
                this.activeUserAndGetBalance()
            }
        } else {
            console.log('Error! Not found.')
            history.pushState({}, '', '/404')
            await this.activateRoute()
        }
    }

    clickButtonCategoriesAndExit() {
        document.querySelectorAll('.link-btn').forEach(el => {
            el.addEventListener('click', (item) => {
                el.style.backgroundColor = '#0D6EFD'
            })
        })
        this.arrowPageElement = document.getElementById('turn')
        this.hiddenPageElement = document.getElementById('item-hidden')
        this.buttonPageElement = document.getElementsByClassName('item-button')
        this.categoriesPageElement.style.border = '0'
        this.arrowPageElement.style.transform = 'rotate(90deg)'
        this.buttonPageElement[2].style.backgroundColor = '#0D6EFD'
        this.buttonPageElement[2].style.color = '#FFFFFF'
        this.buttonPageElement[2].childNodes[1].style.fill = '#FFFFFF'
        if (this.hiddenPageElement.classList.contains('open')) {
            this.buttonPageElement[2].style.backgroundColor = '#FFFFFFFF'
            this.buttonPageElement[2].style.color = '#000000'
            this.buttonPageElement[2].childNodes[1].style.fill = '#000000'
            this.arrowPageElement.style.transform = 'rotate(0deg)'
            this.hiddenPageElement.classList.remove('open')
        } else {
            this.buttonPageElement[2].style.backgroundColor = '#0D6EFD'
            this.buttonPageElement[2].style.color = '#FFFFFFFF'
            this.hiddenPageElement.classList.add('open')
        }
    }

    async activeUserAndGetBalance() {
        // if (document.getElementById('sidebar').getAttribute('style').indexOf('display: none') !== 0) {
        const objUser = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey))
        let userText = document.getElementById('user-name')
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) && AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey) && (window.location.pathname !== '/login'&& window.location.pathname !== '/sign-up')) {
            if(userText){
                userText.innerText = `${objUser.name} ${objUser.lastName}`
            }
            document.getElementById('exit').setAttribute('style', 'display: flex !important')

            const result = await HttpUtils.request('/balance')
            if (result.error || result.redirect || !result.response || (result.response && (result.response.error || result.response.message))) {
                console.log(result.response.message)
                return alert('Произошла ошибка в отображении баланса!')
            }
            document.getElementById('balance').innerText = result.response.balance + '$'
        } else{
            return
        }

    }
}

